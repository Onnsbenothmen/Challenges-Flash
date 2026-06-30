const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'portail_inspections',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('error', (err) => {
  console.error('Erreur inattendue sur le pool PostgreSQL', err);
  process.exit(-1);
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connexion PostgreSQL établie avec succès');
    client.release();
    return true;
  } catch (err) {
    console.error('Échec de connexion à PostgreSQL:', err.message);
    return false;
  }
}

module.exports = { pool, testConnection };
