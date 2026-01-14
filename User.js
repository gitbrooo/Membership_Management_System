const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password, fullName, role = 'viewer') {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO user_profiles (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, is_active, created_at`,
      [email, passwordHash, fullName, role]
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM user_profiles WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT id, email, full_name, role, is_active, created_at FROM user_profiles WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query(
      'SELECT id, email, full_name, role, is_active, created_at FROM user_profiles ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'password_hash') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await db.query(
      `UPDATE user_profiles SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, full_name, role, is_active`,
      values
    );

    return result.rows[0];
  }

  static async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  static async hasAnyUsers() {
    const result = await db.query('SELECT COUNT(*) as count FROM user_profiles');
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = User;
