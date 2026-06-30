const Client = require('../models/Client');
const Quote = require('../models/Quote');
const QuoteItem = require('../models/QuoteItem');

const mockPool = {
  query: jest.fn(),
};

describe('Client Model', () => {
  const client = new Client(mockPool);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create() inserts a new client', async () => {
    const data = {
      company_name: 'Test SARL',
      contact_name: 'Jean Test',
      email: 'jean@test.fr',
      phone: '+33 6 00 00 00 00',
      address: '1 rue Test, Paris',
    };
    mockPool.query.mockResolvedValue({ rows: [{ id: 1, ...data }] });

    const result = await client.create(data);
    expect(result.company_name).toBe('Test SARL');
    expect(mockPool.query).toHaveBeenCalledTimes(1);
  });

  test('findById() returns null for non-existent client', async () => {
    mockPool.query.mockResolvedValue({ rows: [] });
    const result = await client.findById(999);
    expect(result).toBeNull();
  });

  test('findAll() returns all clients', async () => {
    mockPool.query.mockResolvedValue({
      rows: [
        { id: 1, company_name: 'A' },
        { id: 2, company_name: 'B' },
      ],
    });
    const result = await client.findAll();
    expect(result).toHaveLength(2);
  });
});

describe('Quote Model', () => {
  const quote = new Quote(mockPool);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create() inserts a new quote', async () => {
    const data = { title: 'Test Devis', description: 'Description test' };
    mockPool.query.mockResolvedValue({ rows: [{ id: 1, client_id: 1, ...data }] });

    const result = await quote.create(1, data);
    expect(result.title).toBe('Test Devis');
  });

  test('findById() returns quote with items', async () => {
    mockPool.query
      .mockResolvedValueOnce({
        rows: [{ id: 1, title: 'Test', company_name: 'Client' }],
      })
      .mockResolvedValueOnce({
        rows: [
          { id: 1, description: 'Item 1', quantity: 2, unit_price: '100.00', total_price: '200.00' },
        ],
      });

    const result = await quote.findById(1);
    expect(result.title).toBe('Test');
    expect(result.items).toHaveLength(1);
  });

  test('findAll() with status filter', async () => {
    mockPool.query.mockResolvedValue({
      rows: [{ id: 1, title: 'Test', status: 'draft' }],
    });
    const result = await quote.findAll({ status: 'draft' });
    expect(result).toHaveLength(1);
  });
});

describe('QuoteItem Model', () => {
  const item = new QuoteItem(mockPool);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('bulkCreate() inserts multiple items', async () => {
    const items = [
      { description: 'Item 1', quantity: 1, unit_price: 100 },
      { description: 'Item 2', quantity: 2, unit_price: 50 },
    ];
    mockPool.query.mockResolvedValue({ rows: items });

    const result = await item.bulkCreate(1, items);
    expect(result).toHaveLength(2);
  });

  test('deleteByQuoteId() removes items', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 2 });
    const result = await item.deleteByQuoteId(1);
    expect(result).toBe(2);
  });
});
