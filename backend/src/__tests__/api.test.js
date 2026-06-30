const request = require('supertest');

const mockPool = {
  query: jest.fn(),
};

jest.mock('../config/database', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn().mockResolvedValue({ release: jest.fn() }),
    on: jest.fn(),
  },
  testConnection: jest.fn().mockResolvedValue(true),
}));

const app = require('../index');

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      expect(res.body.error).toBeDefined();
    });

    test('rejects missing required fields', async () => {
      const res = await request(app).post('/api/quotes').send({
        client: { company_name: '' },
        quote: { title: '' },
      });
      expect(res.status).toBe(400);
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
