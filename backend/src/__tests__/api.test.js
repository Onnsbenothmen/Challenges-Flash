const request = require('supertest');

jest.mock('../config/database', () => {
  const Database = require('better-sqlite3');
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE clients (id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT NOT NULL, contact_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, address TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, client_id INTEGER REFERENCES clients(id), title TEXT NOT NULL, description TEXT, status TEXT DEFAULT 'draft', total_amount REAL DEFAULT 0, valid_until TEXT, notes TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE quote_items (id INTEGER PRIMARY KEY AUTOINCREMENT, quote_id INTEGER REFERENCES quotes(id) ON DELETE CASCADE, description TEXT NOT NULL, quantity INTEGER NOT NULL DEFAULT 1, unit_price REAL NOT NULL, total_price REAL AS (quantity * unit_price) STORED);
  `);
  return db;
});

const app = require('../index');

describe('API Routes', () => {
  describe('GET /api/health', () => {
    test('returns ok status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /api/quotes', () => {
    test('rejects empty body with 400', async () => {
      const res = await request(app).post('/api/quotes').send({});
      expect(res.status).toBe(400);
    });

    test('rejects missing required fields', async () => {
      const res = await request(app).post('/api/quotes').send({
        client: { company_name: '' },
        quote: { title: '' },
      });
      expect(res.status).toBe(400);
    });

    test('creates a quote with valid data', async () => {
      const res = await request(app).post('/api/quotes').send({
        client: { company_name: 'Test SARL', contact_name: 'Jean', email: 'jean@test.fr' },
        quote: { title: 'Devis test', items: [{ description: 'Service', quantity: 1, unit_price: 100 }] },
      });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Devis test');
    });
  });

  describe('GET /api/quotes/:id', () => {
    test('rejects non-numeric id', async () => {
      const res = await request(app).get('/api/quotes/abc');
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/quotes/:id', () => {
    test('rejects non-numeric id', async () => {
      const res = await request(app).delete('/api/quotes/abc');
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/pdf/quote/:id', () => {
    test('rejects non-numeric id', async () => {
      const res = await request(app).get('/api/pdf/quote/abc');
      expect(res.status).toBe(400);
    });
  });
});
