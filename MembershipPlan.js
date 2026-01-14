const db = require('../config/database');

class MembershipPlan {
  static async create(planData) {
    const { name, description, durationMonths, price } = planData;

    const result = await db.query(
      `INSERT INTO membership_plans (name, description, duration_months, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, durationMonths, price]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM membership_plans WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getAll(activeOnly = false) {
    let query = 'SELECT * FROM membership_plans';
    if (activeOnly) {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY price ASC';

    const result = await db.query(query);
    return result.rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id') {
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
      `UPDATE membership_plans SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }
}

module.exports = MembershipPlan;
