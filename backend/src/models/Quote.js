class Quote {
  constructor(db) {
    this.db = db;
  }

  create(clientId, data) {
    const stmt = this.db.prepare(
      `INSERT INTO quotes (client_id, title, description, valid_until, notes)
       VALUES (?, ?, ?, ?, ?)`
    );
    const result = stmt.run(clientId, data.title, data.description || null, data.valid_until || null, data.notes || null);
    return this.findById(result.lastInsertRowid);
  }

  findById(id) {
    const quote = this.db.prepare(
      `SELECT q.*, c.company_name, c.contact_name, c.email, c.phone, c.address
       FROM quotes q
       JOIN clients c ON q.client_id = c.id
       WHERE q.id = ?`
    ).get(id);

    if (!quote) return null;

    quote.items = this.db.prepare('SELECT * FROM quote_items WHERE quote_id = ? ORDER BY id').all(id);
    return quote;
  }

  findAll(filters = {}) {
    let sql = `SELECT q.*, c.company_name, c.contact_name
               FROM quotes q
               JOIN clients c ON q.client_id = c.id`;
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push('q.status = ?');
      params.push(filters.status);
    }

    if (filters.client_id) {
      conditions.push('q.client_id = ?');
      params.push(filters.client_id);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY q.created_at DESC';

    return this.db.prepare(sql).all(...params);
  }

  update(id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'items') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    this.db.prepare(`UPDATE quotes SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  updateTotalAmount(id) {
    this.db.prepare(
      `UPDATE quotes SET total_amount = (
         SELECT COALESCE(SUM(total_price), 0)
         FROM quote_items WHERE quote_id = ?
       ), updated_at = datetime('now')
       WHERE id = ?`
    ).run(id, id);
    return this.findById(id);
  }
}

module.exports = Quote;
