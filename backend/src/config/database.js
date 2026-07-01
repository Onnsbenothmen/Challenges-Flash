const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'portail.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER REFERENCES clients(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    total_amount REAL DEFAULT 0,
    valid_until TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS quote_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_id INTEGER REFERENCES quotes(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price REAL NOT NULL,
    total_price REAL GENERATED ALWAYS AS (quantity * unit_price) STORED
  );

  CREATE INDEX IF NOT EXISTS idx_quotes_client ON quotes(client_id);
  CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
`);

const seed = () => {
  const count = db.prepare('SELECT COUNT(*) as c FROM clients').get();
  if (count.c > 0) return;

  const insertClient = db.prepare('INSERT INTO clients (company_name, contact_name, email, phone, address) VALUES (?, ?, ?, ?, ?)');
  const insertQuote = db.prepare('INSERT INTO quotes (client_id, title, description, status, total_amount, valid_until) VALUES (?, ?, ?, ?, ?, ?)');
  const insertItem = db.prepare('INSERT INTO quote_items (quote_id, description, quantity, unit_price) VALUES (?, ?, ?, ?)');

  const c1 = insertClient.run('Tech Industries SAS', 'Jean Dupont', 'jean@techindustries.fr', '+33 1 23 45 67 89', '15 Rue de la Paix, 75001 Paris');
  const c2 = insertClient.run('Bâtiment Moderne SARL', 'Marie Martin', 'marie@batmoderne.fr', '+33 6 98 76 54 32', '8 Avenue des Travaux, 69002 Lyon');
  const c3 = insertClient.run('Services Pro', 'Pierre Durand', 'pierre@services-pro.com', null, '25 Boulevard Industriel, 13003 Marseille');

  const q1 = insertQuote.run(c1.lastInsertRowid, 'Inspection électrique annuelle', 'Inspection complète des installations électriques', 'draft', 2500.00, '2026-08-31');
  const q2 = insertQuote.run(c2.lastInsertRowid, 'Diagnostic structure bâtiment', 'Analyse de la structure porteuse', 'sent', 5800.00, '2026-09-15');
  const q3 = insertQuote.run(c3.lastInsertRowid, 'Audit conformité incendie', 'Vérification des normes de sécurité', 'approved', 3200.00, '2026-07-30');

  insertItem.run(q1.lastInsertRowid, 'Visite technique des installations', 1, 1200.00);
  insertItem.run(q1.lastInsertRowid, "Rapport d'inspection détaillé", 1, 800.00);
  insertItem.run(q1.lastInsertRowid, 'Tests de conformité électrique', 5, 100.00);
  insertItem.run(q2.lastInsertRowid, 'Analyse structurelle', 1, 3000.00);
  insertItem.run(q2.lastInsertRowid, 'Relevés sur site', 2, 800.00);
  insertItem.run(q2.lastInsertRowid, "Rapport d'expertise", 1, 1200.00);
  insertItem.run(q3.lastInsertRowid, 'Audit complet des équipements', 1, 1800.00);
  insertItem.run(q3.lastInsertRowid, 'Préconisations correctives', 1, 900.00);
  insertItem.run(q3.lastInsertRowid, 'Certification de conformité', 1, 500.00);
};

seed();

module.exports = db;
