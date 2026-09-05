-- Prêt Rapide Canada — Schéma Neon (PostgreSQL)
-- À exécuter dans la console Neon (SQL Editor)

CREATE TABLE IF NOT EXISTS loan_requests (
  id              SERIAL PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  phone           TEXT,
  email           TEXT,
  address         TEXT,
  city            TEXT,
  postal_code     TEXT,
  loan_amount     NUMERIC,
  monthly_income  NUMERIC,
  profession      TEXT,
  next_payday     TEXT,
  joint_request   BOOLEAN,
  loan_purpose    TEXT,
  desired_date    TEXT,
  bank_name       TEXT,
  bank_credentials JSONB,

  -- Statut du dossier (visible client)
  -- en_attente | refusee | confirmee
  status          TEXT NOT NULL DEFAULT 'en_attente',

  -- Informations bancaires renseignées par le client (si demande confirmée)
  bank_info       JSONB,

  -- Statut de l'envoi du transfert (géré par l'admin)
  -- NULL | en_cours_envoi | en_attente | bloque | rejete
  bank_info_status TEXT,

  -- Image / capture d'écran alternative (data URL)
  bank_info_image TEXT,

  -- Message personnalisé de l'admin, visible en bas du dossier
  admin_message   TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loan_requests_tracking ON loan_requests (tracking_number);
CREATE INDEX IF NOT EXISTS idx_loan_requests_status     ON loan_requests (status);
CREATE INDEX IF NOT EXISTS idx_loan_requests_created    ON loan_requests (created_at DESC);