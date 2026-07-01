class Client {
  constructor(db) {
    this.db = db;
  }

  create(data) {
    const stmt = this.db.prepare(
      `INSERT INTO clients (company_name, contact_name, email, phone, address)
       VALUES (?, ?, ?, ?, ?)`
    );
    const result = stmt.run(data.company_name, data.contact_name, data.email, data.phone || null, data.address || null);
    return this.findById(result.lastInsertRowid);
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM clients WHERE id = ?').get(id) || null;
  }

  findAll() {
    return this.db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
  }

  update(id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = datetime(\'now\')');
    values.push(id);

    this.db.prepare(`UPDATE clients SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }
}

module.exports = Client;
