const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Données invalides',
        details: errors.array().map(e => ({
          field: e.path,
          message: e.msg,
        })),
      },
    });
  }
  next();
};

const validateQuote = [
  body('client.company_name')
    .trim().notEmpty().withMessage('Le nom de l\'entreprise est requis')
    .isLength({ max: 255 }).withMessage('Maximum 255 caractères'),
  body('client.contact_name')
    .trim().notEmpty().withMessage('Le nom du contact est requis')
    .isLength({ max: 255 }).withMessage('Maximum 255 caractères'),
  body('client.email')
    .trim().notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide'),
  body('client.phone')
    .optional({ values: 'falsy' })
    .trim().isLength({ max: 50 }).withMessage('Maximum 50 caractères'),
  body('client.address')
    .optional({ values: 'falsy' }).trim(),
  body('quote.title')
    .trim().notEmpty().withMessage('Le titre du devis est requis')
    .isLength({ max: 255 }).withMessage('Maximum 255 caractères'),
  body('quote.description')
    .optional({ values: 'falsy' }).trim(),
  body('quote.valid_until')
    .optional({ values: 'falsy' }).isDate().withMessage('Date invalide'),
  body('quote.items')
    .isArray({ min: 1 }).withMessage('Au moins un élément requis'),
  body('quote.items.*.description')
    .trim().notEmpty().withMessage('Description requise')
    .isLength({ max: 500 }).withMessage('Maximum 500 caractères'),
  body('quote.items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantité doit être >= 1'),
  body('quote.items.*.unit_price')
    .isFloat({ min: 0 }).withMessage('Prix unitaire doit être >= 0'),
  handleValidationErrors,
];

const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors,
];

module.exports = { validateQuote, validateId };
