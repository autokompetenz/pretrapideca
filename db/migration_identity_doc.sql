-- Migration: ajout pièce d'identité client
-- À exécuter sur une base existante (Neon SQL Editor)

ALTER TABLE loan_requests
  ADD COLUMN IF NOT EXISTS identity_doc_type  TEXT,
  ADD COLUMN IF NOT EXISTS identity_doc_image TEXT;
