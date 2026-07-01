const Client = require('../models/Client');
const Quote = require('../models/Quote');
const QuoteItem = require('../models/QuoteItem');
const { createTestDb } = require('./helpers');

describe('Client Model', () => {
  let db;
  let client;

  beforeEach(() => {
    db = createTestDb();
    client = new Client(db);
  });

  test('create() inserts a new client', () => {
    const result = client.create({
      company_name: 'Test SARL',
      contact_name: 'Jean Test',
      email: 'jean@test.fr',
      phone: '+33 6 00 00 00 00',
      address: '1 rue Test, Paris',
    });
    expect(result.company_name).toBe('Test SARL');
    expect(result.id).toBe(1);
  });

  test('findById() returns null for non-existent client', () => {
    const result = client.findById(999);
    expect(result).toBeUndefined();
  });

  test('findAll() returns all clients', () => {
    client.create({ company_name: 'A', contact_name: 'C1', email: 'a@a.fr' });
    client.create({ company_name: 'B', contact_name: 'C2', email: 'b@b.fr' });
    const result = client.findAll();
    expect(result).toHaveLength(2);
  });
});

describe('Quote Model', () => {
  let db;
  let quote;
  let clientId;

  beforeEach(() => {
    db = createTestDb();
    quote = new Quote(db);
    const c = new Client(db);
    const cl = c.create({ company_name: 'Test', contact_name: 'T', email: 't@t.fr' });
    clientId = cl.id;
  });

  test('create() inserts a new quote', () => {
    const result = quote.create(clientId, { title: 'Test Devis', description: 'Desc' });
    expect(result.title).toBe('Test Devis');
  });

  test('findById() returns quote with items', () => {
    const q = quote.create(clientId, { title: 'Test' });
    const itemModel = new QuoteItem(db);
    itemModel.create(q.id, { description: 'Item 1', quantity: 2, unit_price: 100 });

    const result = quote.findById(q.id);
    expect(result.title).toBe('Test');
    expect(result.items).toHaveLength(1);
  });

  test('findAll() with status filter', () => {
    quote.create(clientId, { title: 'A' });
    const results = quote.findAll({ status: 'draft' });
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

describe('QuoteItem Model', () => {
  let db;
  let item;
  let quoteId;

  beforeEach(() => {
    db = createTestDb();
    item = new QuoteItem(db);
    const c = new Client(db);
    const cl = c.create({ company_name: 'T', contact_name: 'T', email: 't@t.fr' });
    const q = new Quote(db);
    const qu = q.create(cl.id, { title: 'Test' });
    quoteId = qu.id;
  });

  test('bulkCreate() inserts multiple items', () => {
    const items = [
      { description: 'Item 1', quantity: 1, unit_price: 100 },
      { description: 'Item 2', quantity: 2, unit_price: 50 },
    ];
    const result = item.bulkCreate(quoteId, items);
    expect(result).toHaveLength(2);
  });

  test('deleteByQuoteId() removes items', () => {
    item.create(quoteId, { description: 'Test', quantity: 1, unit_price: 10 });
    const result = item.deleteByQuoteId(quoteId);
    expect(result).toBe(1);
  });
});
