class Client {
  constructor(pool) {
    this.pool = pool;
  }

  async create(data) {
    const { rows } = await this.pool.query(
      `INSERT INTO clients (company_name, contact_name, email, phone, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.company_name, data.contact_name, data.email, data.phone || null, data.address || null]
    );
    return rows[0];
  }

  async findById(id) {
    const { rows } = await this.pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async findAll() {
    const { rows } = await this.pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    return rows;
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const { rows } = await this.pool.query(
      `UPDATE clients SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  }
}

module.exports = Client;
