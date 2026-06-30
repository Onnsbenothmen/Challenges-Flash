class Quote {
  constructor(pool) {
    this.pool = pool;
  }

  async create(clientId, data) {
    const { rows } = await this.pool.query(
      `INSERT INTO quotes (client_id, title, description, valid_until, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [clientId, data.title, data.description || null, data.valid_until || null, data.notes || null]
    );
    return rows[0];
  }

  async findById(id) {
    const { rows } = await this.pool.query(
      `SELECT q.*, c.company_name, c.contact_name, c.email, c.phone, c.address
       FROM quotes q
       JOIN clients c ON q.client_id = c.id
       WHERE q.id = $1`,
      [id]
    );
    if (!rows[0]) return null;

    const { rows: items } = await this.pool.query(
      'SELECT * FROM quote_items WHERE quote_id = $1 ORDER BY id',
      [id]
    );

    return { ...rows[0], items };
  }

  async findAll(filters = {}) {
    let query = `SELECT q.*, c.company_name, c.contact_name
                 FROM quotes q
                 JOIN clients c ON q.client_id = c.id`;
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push(`q.status = $${params.length + 1}`);
      params.push(filters.status);
    }

    if (filters.client_id) {
      conditions.push(`q.client_id = $${params.length + 1}`);
      params.push(filters.client_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY q.created_at DESC';

    const { rows } = await this.pool.query(query, params);
    return rows;
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'items') {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const { rows } = await this.pool.query(
      `UPDATE quotes SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  }

  async updateTotalAmount(id) {
    const { rows } = await this.pool.query(
      `UPDATE quotes SET total_amount = (
         SELECT COALESCE(SUM(total_price), 0)
         FROM quote_items WHERE quote_id = $1
       ), updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return rows[0];
  }
}

module.exports = Quote;
