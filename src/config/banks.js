export const BANKS = [
  { id: 'desjardins',        name: 'Caisse Desjardins',              url: 'https://accweb.mouv.desjardins.com/' },
  { id: 'td',                name: 'Banque TD',                     url: 'https://authentication.td.com/' },
  { id: 'laurentienne',      name: 'Banque Laurentienne',           url: 'https://auth.banquelaurentienne.ca/' },
  { id: 'koho',              name: 'KOHO',                          url: 'https://web.koho.ca/' },
  { id: 'pc-finance',        name: 'PC Financial',                  url: 'https://secure.pcfinancial.ca/' },
  { id: 'cibc',              name: 'Banque CIBC',                   url: 'https://www.cibconline.cibc.com/' },
  { id: 'eq',                name: 'Banque EQ',                     url: 'https://auth.eqbank.ca/' },
  { id: 'tangerine',         name: 'Tangerine',                     url: 'https://www.tangerine.ca/' },
  { id: 'rbc',               name: 'Banque RBC',                    url: 'https://secure.royalbank.com/' },
  { id: 'bmo-us-digital',    name: 'Bank of Montreal (Portail US)', url: 'https://www1.bmo.com/' },
  { id: 'nationale',         name: 'Banque Nationale',              url: 'https://connexion.bnc.ca/' },
  { id: 'scotia',            name: 'Scotiabank',                    url: 'https://auth.scotiaonline.scotiabank.com/' },
  { id: 'bmo-digital',       name: 'BMO (Digital Banking)',         url: 'https://www1.bmo.com/' },
  { id: 'wealthsimple',      name: 'Wealthsimple',                  url: 'https://my.wealthsimple.com/' },
];

export const BANK_FIELDS = {
  desjardins: {
    logo: '💳',
    fields: [
      { name: 'identifiant', label: "Identifiant AccèsD ou n° de carte", type: 'text', placeholder: 'Identifiant AccèsD' },
      { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
    ],
  },
  td: { logo: '🏦', fields: [
    { name: 'identifiant', label: "N° de carte d'accès ou nom d'utilisateur", type: 'text', placeholder: "Carte d'accès" },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  laurentienne: { logo: '🏛', fields: [
    { name: 'code_utilisateur', label: 'Code utilisateur', type: 'text', placeholder: 'Code utilisateur' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  koho: { logo: '💎', fields: [
    { name: 'courriel', label: 'Adresse e-mail', type: 'email', placeholder: 'prenom@exemple.com' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  'pc-finance': { logo: '🛒', fields: [
    { name: 'identifiant', label: "Nom d'utilisateur ou e-mail", type: 'text', placeholder: "Nom d'utilisateur" },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  cibc: { logo: '🔴', fields: [
    { name: 'carte', label: 'Numéro de carte bancaire', type: 'text', placeholder: 'Numéro de carte' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  eq: { logo: '💰', fields: [
    { name: 'courriel', label: 'Adresse e-mail', type: 'email', placeholder: 'prenom@exemple.com' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  tangerine: { logo: '🍊', fields: [
    { name: 'identifiant', label: "Numéro de client ou nom d'utilisateur", type: 'text', placeholder: 'N° de client' },
    { name: 'pin', label: 'PIN / Télécode numérique', type: 'password', placeholder: '••••' },
  ]},
  rbc: { logo: '🦁', fields: [
    { name: 'identifiant', label: "N° de carte client ou nom d'utilisateur", type: 'text', placeholder: 'Carte client' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  'bmo-us-digital': { logo: '🏦', fields: [
    { name: 'identifiant', label: 'Identifiant utilisateur', type: 'text', placeholder: 'Identifiant utilisateur' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  nationale: { logo: '🏛', fields: [
    { name: 'code_utilisateur', label: 'Code utilisateur', type: 'text', placeholder: 'Code utilisateur' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  scotia: { logo: '🔶', fields: [
    { name: 'identifiant', label: "Carte bancaire ou nom d'utilisateur", type: 'text', placeholder: 'Carte bancaire' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  'bmo-digital': { logo: '🏦', fields: [
    { name: 'identifiant', label: 'N° de carte de débit ou identifiant BMO', type: 'text', placeholder: 'Carte de débit' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  wealthsimple: { logo: '⚡', fields: [
    { name: 'courriel', label: 'Adresse e-mail', type: 'email', placeholder: 'prenom@exemple.com' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
};

export const BANKS_LOOKUP = BANKS.reduce((acc, b) => ({ ...acc, [b.id]: b.name }), {});
