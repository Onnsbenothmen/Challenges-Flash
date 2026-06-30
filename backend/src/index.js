require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const quoteRoutes = require('./routes/quotes');
const pdfRoutes = require('./routes/pdf');
const { errorHandler } = require('./middleware/errorHandler');
const { pool } = require('./config/database');

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

app.locals.pool = pool;

app.use('/api/quotes', quoteRoutes);
app.use('/api/pdf', pdfRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

module.exports = app;
