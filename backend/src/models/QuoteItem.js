class QuoteItem {
  constructor(pool) {
    this.pool = pool;
  }

  async create(quoteId, data) {
    const { rows } = await this.pool.query(
      `INSERT INTO quote_items (quote_id, description, quantity, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [quoteId, data.description, data.quantity, data.unit_price]
    );
    return rows[0];
  }

  async findByQuoteId(quoteId) {
    const { rows } = await this.pool.query(
      'SELECT * FROM quote_items WHERE quote_id = $1 ORDER BY id',
      [quoteId]
    );
    return rows;
  }

  async bulkCreate(quoteId, items) {
    if (items.length === 0) return [];

    const values = items.map((_, i) =>
      `($1, $${i * 3 + 2}, $${i * 3 + 3}, $${i * 3 + 4})`
    ).join(', ');

    const flatValues = [quoteId];
    for (const item of items) {
      flatValues.push(item.description, item.quantity, item.unit_price);
    }

    const { rows } = await this.pool.query(
      `INSERT INTO quote_items (quote_id, description, quantity, unit_price)
       VALUES ${values} RETURNING *`,
      flatValues
    );
    return rows;
  }

  async deleteByQuoteId(quoteId) {
    const { rowCount } = await this.pool.query(
      'DELETE FROM quote_items WHERE quote_id = $1',
      [quoteId]
    );
    return rowCount;
  }
}

module.exports = QuoteItem;
