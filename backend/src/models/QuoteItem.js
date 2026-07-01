class QuoteItem {
  constructor(db) {
    this.db = db;
  }

  create(quoteId, data) {
    const stmt = this.db.prepare(
      `INSERT INTO quote_items (quote_id, description, quantity, unit_price)
       VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(quoteId, data.description, data.quantity, data.unit_price);
    return this.db.prepare('SELECT * FROM quote_items WHERE id = ?').get(result.lastInsertRowid);
  }

  findByQuoteId(quoteId) {
    return this.db.prepare('SELECT * FROM quote_items WHERE quote_id = ? ORDER BY id').all(quoteId);
  }

  bulkCreate(quoteId, items) {
    const stmt = this.db.prepare(
      `INSERT INTO quote_items (quote_id, description, quantity, unit_price)
       VALUES (?, ?, ?, ?)`
    );

    const insertMany = this.db.transaction((items) => {
      for (const item of items) {
        stmt.run(quoteId, item.description, item.quantity, item.unit_price);
      }
    });

    insertMany(items);
    return this.findByQuoteId(quoteId);
  }

  deleteByQuoteId(quoteId) {
    const result = this.db.prepare('DELETE FROM quote_items WHERE quote_id = ?').run(quoteId);
    return result.changes;
  }
}

module.exports = QuoteItem;
