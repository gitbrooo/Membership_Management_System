const db = require('../config/database');

class Payment {
  static async create(paymentData, createdBy) {
    const {
      memberId,
      amount,
      paymentMethod,
      paymentDate,
      paymentFor,
      notes
    } = paymentData;

    const result = await db.query(
      `INSERT INTO payments (member_id, amount, payment_method, payment_date, payment_for, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [memberId, amount, paymentMethod, paymentDate, paymentFor, notes, createdBy]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT p.*, m.first_name, m.last_name, m.email
       FROM payments p
       JOIN members m ON p.member_id = m.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT p.*, m.first_name, m.last_name, m.email
      FROM payments p
      JOIN members m ON p.member_id = m.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.memberId) {
      query += ` AND p.member_id = $${paramCount}`;
      values.push(filters.memberId);
      paramCount++;
    }

    if (filters.paymentFor) {
      query += ` AND p.payment_for = $${paramCount}`;
      values.push(filters.paymentFor);
      paramCount++;
    }

    if (filters.startDate) {
      query += ` AND p.payment_date >= $${paramCount}`;
      values.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      query += ` AND p.payment_date <= $${paramCount}`;
      values.push(filters.endDate);
      paramCount++;
    }

    query += ' ORDER BY p.payment_date DESC, p.created_at DESC';

    const result = await db.query(query, values);
    return result.rows;
  }

  static async getTotalRevenue() {
    const result = await db.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM payments'
    );
    return parseFloat(result.rows[0].total);
  }

  static async getRevenueByMonth(months = 6) {
    const result = await db.query(
      `SELECT
         TO_CHAR(payment_date, 'YYYY-MM') as month,
         SUM(amount) as revenue,
         COUNT(*) as count
       FROM payments
       WHERE payment_date >= CURRENT_DATE - INTERVAL '${months} months'
       GROUP BY TO_CHAR(payment_date, 'YYYY-MM')
       ORDER BY month DESC`
    );
    return result.rows;
  }
}

module.exports = Payment;
