USE ynov_ci;

ALTER TABLE utilisateur
  ADD COLUMN prenom VARCHAR(100) NULL AFTER nom,
  ADD COLUMN date_naissance DATE NULL AFTER email,
  ADD COLUMN code_postal VARCHAR(5) NULL AFTER date_naissance,
  ADD COLUMN ville VARCHAR(100) NULL AFTER code_postal;
