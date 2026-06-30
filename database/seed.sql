INSERT INTO clients (company_name, contact_name, email, phone, address) VALUES
  ('Tech Industries SAS', 'Jean Dupont', 'jean.dupont@techindustries.fr', '+33 1 23 45 67 89', '15 Rue de la Paix, 75001 Paris'),
  ('Bâtiment Moderne SARL', 'Marie Martin', 'marie.martin@batmoderne.fr', '+33 6 98 76 54 32', '8 Avenue des Travaux, 69002 Lyon'),
  ('Services Pro', 'Pierre Durand', 'pierre@services-pro.com', NULL, '25 Boulevard Industriel, 13003 Marseille')
ON CONFLICT DO NOTHING;

INSERT INTO quotes (client_id, title, description, status, total_amount, valid_until) VALUES
  (1, 'Inspection électrique annuelle', 'Inspection complète des installations électriques du site de production', 'draft', 2500.00, '2026-08-31'),
  (2, 'Diagnostic structure bâtiment', 'Analyse de la structure porteuse du bâtiment principal', 'sent', 5800.00, '2026-09-15'),
  (3, 'Audit conformité incendie', 'Vérification complète des normes de sécurité incendie', 'approved', 3200.00, '2026-07-30')
ON CONFLICT DO NOTHING;

INSERT INTO quote_items (quote_id, description, quantity, unit_price) VALUES
  (1, 'Visite technique des installations', 1, 1200.00),
  (1, 'Rapport d''inspection détaillé', 1, 800.00),
  (1, 'Tests de conformité électrique', 5, 100.00),
  (2, 'Analyse structurelle', 1, 3000.00),
  (2, 'Relevés sur site', 2, 800.00),
  (2, 'Rapport d''expertise', 1, 1200.00),
  (3, 'Audit complet des équipements', 1, 1800.00),
  (3, 'Préconisations correctives', 1, 900.00),
  (3, 'Certification de conformité', 1, 500.00)
ON CONFLICT DO NOTHING;
