const Client = require('../models/Client');
const Quote = require('../models/Quote');
const QuoteItem = require('../models/QuoteItem');
const { AppError } = require('../middleware/errorHandler');

exports.createQuote = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const clientModel = new Client(pool);
    const quoteModel = new Quote(pool);
    const itemModel = new QuoteItem(pool);

    const { client: clientData, quote: quoteData } = req.body;

    const client = await clientModel.create(clientData);

    const quote = await quoteModel.create(client.id, quoteData);

    if (quoteData.items && quoteData.items.length > 0) {
      await itemModel.bulkCreate(quote.id, quoteData.items);
    }

    await quoteModel.updateTotalAmount(quote.id);

    const result = await quoteModel.findById(quote.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getAllQuotes = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const quoteModel = new Quote(pool);
    const filters = {};

    if (req.query.status) filters.status = req.query.status;
    if (req.query.client_id) filters.client_id = parseInt(req.query.client_id);

    const quotes = await quoteModel.findAll(filters);
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};

exports.getQuoteById = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const quoteModel = new Quote(pool);
    const quote = await quoteModel.findById(parseInt(req.params.id));

    if (!quote) {
      throw new AppError('Devis non trouvé', 404);
    }

    res.json(quote);
  } catch (err) {
    next(err);
  }
};

exports.updateQuote = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const quoteModel = new Quote(pool);
    const itemModel = new QuoteItem(pool);

    const quoteId = parseInt(req.params.id);
    const existing = await quoteModel.findById(quoteId);

    if (!existing) {
      throw new AppError('Devis non trouvé', 404);
    }

    const { client, quote } = req.body;

    if (client) {
      const clientModel = new Client(pool);
      await clientModel.update(existing.client_id, client);
    }

    if (quote) {
      await quoteModel.update(quoteId, quote);

      if (quote.items) {
        await itemModel.deleteByQuoteId(quoteId);
        await itemModel.bulkCreate(quoteId, quote.items);
      }

      await quoteModel.updateTotalAmount(quoteId);
    }

    const result = await quoteModel.findById(quoteId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteQuote = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const quoteModel = new Quote(pool);

    const quoteId = parseInt(req.params.id);
    const existing = await quoteModel.findById(quoteId);

    if (!existing) {
      throw new AppError('Devis non trouvé', 404);
    }

    await pool.query('DELETE FROM quotes WHERE id = $1', [quoteId]);
    res.json({ message: 'Devis supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};
