const db = require('../config/database');

class Member {
  static async create(memberData) {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      membershipPlanId,
      status,
      joinDate,
      expiryDate
    } = memberData;

    const result = await db.query(
      `INSERT INTO members (first_name, last_name, email, phone, address, membership_plan_id, status, join_date, expiry_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [firstName, lastName, email, phone, address, membershipPlanId, status || 'active', joinDate, expiryDate]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT m.*, mp.name as plan_name, mp.price as plan_price
       FROM members m
       LEFT JOIN membership_plans mp ON m.membership_plan_id = mp.id
       WHERE m.id = $1 AND m.is_deleted = false`,
      [id]
    );
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT m.*, mp.name as plan_name
      FROM members m
      LEFT JOIN membership_plans mp ON m.membership_plan_id = mp.id
      WHERE m.is_deleted = false
    `;
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND m.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (m.first_name ILIKE $${paramCount} OR m.last_name ILIKE $${paramCount} OR m.email ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY m.created_at DESC';

    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = [
      'first_name', 'last_name', 'email', 'phone', 'address',
      'membership_plan_id', 'status', 'expiry_date'
    ];

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
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
      `UPDATE members SET ${fields.join(', ')} WHERE id = $${paramCount} AND is_deleted = false
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async softDelete(id) {
    const result = await db.query(
      'UPDATE members SET is_deleted = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async getStats() {
    const result = await db.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive
      FROM members
      WHERE is_deleted = false
    `);
    return result.rows[0];
  }
}

module.exports = Member;
