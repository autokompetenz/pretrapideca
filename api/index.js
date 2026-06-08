const express = require('express');
const cors = require('cors');
const { sendClientConfirmation, sendAdminNotification } = require('../lib/mailer.js');

const app = express();

app.use(cors({ origin: ['https://pret-rapide.vercel.app', 'http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '2mb' }));

const BANKS = [
  { id: 'desjardins',      name: 'Caisse Desjardins' },
  { id: 'td',              name: 'Banque TD' },
  { id: 'laurentienne',    name: 'Banque Laurentienne' },
  { id: 'koho',            name: 'KOHO' },
  { id: 'pc-finance',      name: 'PC Financial' },
  { id: 'cibc',            name: 'Banque CIBC' },
  { id: 'eq',              name: 'Banque EQ' },
  { id: 'tangerine',       name: 'Tangerine' },
  { id: 'rbc',             name: 'Banque RBC' },
  { id: 'bmo-us-digital',  name: 'Bank of Montreal (Portail US)' },
  { id: 'nationale',       name: 'Banque Nationale' },
  { id: 'scotia',          name: 'Scotiabank' },
  { id: 'bmo-digital',     name: 'BMO (Digital Banking)' },
  { id: 'wealthsimple',    name: 'Wealthsimple' },
];

app.post('/api/loan', async (req, res) => {
  try {
    const data = req.body;
    console.log('📋 Nouvelle demande de prêt reçue:', JSON.stringify(data, null, 2));

    const bank = BANKS.find(b => b.id === data.bankId);
    const bankName = bank?.name || data.bankId || 'Inconnue';

    const fullData = { ...data, bankName };

    const promises = [sendAdminNotification(fullData)];

    if (data.email) {
      promises.push(sendClientConfirmation({
        email: data.email,
        firstName: data.fullName?.split(' ')[0] || 'Client',
        amount: data.monthlyIncome,
        bankName,
      }));
    }

    await Promise.all(promises);

    res.json({ success: true, message: 'Demande soumise avec succès' });
  } catch (err) {
    console.error('❌ Erreur:', err);
    res.status(500).json({ success: false, message: 'Erreur lors du traitement' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

module.exports = app;
