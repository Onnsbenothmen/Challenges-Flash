const Client = require('../models/Client');
const Quote = require('../models/Quote');
const QuoteItem = require('../models/QuoteItem');
const { AppError } = require('../middleware/errorHandler');

exports.createQuote = (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const clientModel = new Client(db);
    const quoteModel = new Quote(db);
    const itemModel = new QuoteItem(db);

    const { client: clientData, quote: quoteData } = req.body;

    const client = clientModel.create(clientData);
    const quote = quoteModel.create(client.id, quoteData);

    if (quoteData.items && quoteData.items.length > 0) {
      itemModel.bulkCreate(quote.id, quoteData.items);
    }

    quoteModel.updateTotalAmount(quote.id);
    const result = quoteModel.findById(quote.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getAllQuotes = (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const quoteModel = new Quote(db);
    const filters = {};

    if (req.query.status) filters.status = req.query.status;
    if (req.query.client_id) filters.client_id = parseInt(req.query.client_id);

    res.json(quoteModel.findAll(filters));
  } catch (err) {
    next(err);
  }
};

exports.getQuoteById = (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const quoteModel = new Quote(db);
    const quote = quoteModel.findById(parseInt(req.params.id));

    if (!quote) {
      throw new AppError('Devis non trouvé', 404);
    }

    res.json(quote);
  } catch (err) {
    next(err);
  }
};

exports.updateQuote = (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const quoteModel = new Quote(db);
    const itemModel = new QuoteItem(db);

    const quoteId = parseInt(req.params.id);
    const existing = quoteModel.findById(quoteId);

    if (!existing) {
      throw new AppError('Devis non trouvé', 404);
    }

    const { client, quote } = req.body;

    if (client) {
      const clientModel = new Client(db);
      clientModel.update(existing.client_id, client);
    }

    if (quote) {
      quoteModel.update(quoteId, quote);

      if (quote.items) {
        itemModel.deleteByQuoteId(quoteId);
        itemModel.bulkCreate(quoteId, quote.items);
      }

      quoteModel.updateTotalAmount(quoteId);
    }

    res.json(quoteModel.findById(quoteId));
  } catch (err) {
    next(err);
  }
};

exports.deleteQuote = (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const quoteModel = new Quote(db);

    const quoteId = parseInt(req.params.id);
    const existing = quoteModel.findById(quoteId);

    if (!existing) {
      throw new AppError('Devis non trouvé', 404);
    }

    db.prepare('DELETE FROM quotes WHERE id = ?').run(quoteId);
    res.json({ message: 'Devis supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};
