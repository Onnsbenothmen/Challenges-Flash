const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { validateId } = require('../middleware/validation');

router.get('/quote/:id', validateId, pdfController.generateQuotePDF);

module.exports = router;
