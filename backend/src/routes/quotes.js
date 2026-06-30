const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { validateQuote, validateId } = require('../middleware/validation');

router.post('/', validateQuote, quoteController.createQuote);
router.get('/', quoteController.getAllQuotes);
router.get('/:id', validateId, quoteController.getQuoteById);
router.put('/:id', validateId, quoteController.updateQuote);
router.delete('/:id', validateId, quoteController.deleteQuote);

module.exports = router;
