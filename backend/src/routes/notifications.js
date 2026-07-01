const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const Quote = require('../models/Quote');
const { validateId } = require('../middleware/validation');

router.post('/quote/:id/send', validateId, async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const quoteModel = new Quote(db);
    const quoteId = parseInt(req.params.id);
    const quote = quoteModel.findById(quoteId);

    if (!quote) {
      return res.status(404).json({ error: { message: 'Devis non trouvé' } });
    }

    const result = await notificationService.sendQuoteNotification(quote, req.body.type || 'created');
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/status', (req, res) => {
  res.json({
    enabled: notificationService.enabled,
    transporter: !!notificationService.transporter,
  });
});

module.exports = router;
