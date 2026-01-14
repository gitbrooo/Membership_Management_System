const db = require('../config/database');

exports.getDailyStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const result = await db.query(
      `WITH dates AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '${days} days',
          CURRENT_DATE,
          '1 day'::interval
        )::date AS date
      )
      SELECT
        d.date,
        COALESCE(m.count, 0) as new_members,
        COALESCE(p.count, 0) as payments,
        COALESCE(p.revenue, 0) as revenue
      FROM dates d
      LEFT JOIN (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM members
        WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
      ) m ON d.date = m.date
      LEFT JOIN (
        SELECT DATE(payment_date) as date, COUNT(*) as count, SUM(amount) as revenue
        FROM payments
        WHERE payment_date >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(payment_date)
      ) p ON d.date = p.date
      ORDER BY d.date DESC`
    );

    res.json({ stats: result.rows });
  } catch (error) {
    console.error('Get daily stats error:', error);
    res.status(500).json({ error: 'Failed to fetch daily stats' });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;

    const result = await db.query(
      `WITH months AS (
        SELECT generate_series(
          DATE_TRUNC('month', CURRENT_DATE - INTERVAL '${months} months'),
          DATE_TRUNC('month', CURRENT_DATE),
          '1 month'::interval
        )::date AS month
      )
      SELECT
        TO_CHAR(m.month, 'YYYY-MM') as month,
        COALESCE(mem.count, 0) as members,
        COALESCE(p.revenue, 0) as revenue,
        COALESCE(e.count, 0) as events
      FROM months m
      LEFT JOIN (
        SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as count
        FROM members
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '${months} months')
        GROUP BY DATE_TRUNC('month', created_at)
      ) mem ON m.month = mem.month
      LEFT JOIN (
        SELECT DATE_TRUNC('month', payment_date) as month, SUM(amount) as revenue
        FROM payments
        WHERE payment_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '${months} months')
        GROUP BY DATE_TRUNC('month', payment_date)
      ) p ON m.month = p.month
      LEFT JOIN (
        SELECT DATE_TRUNC('month', event_date) as month, COUNT(*) as count
        FROM events
        WHERE event_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '${months} months')
        GROUP BY DATE_TRUNC('month', event_date)
      ) e ON m.month = e.month
      ORDER BY m.month DESC`
    );

    res.json({ stats: result.rows });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly stats' });
  }
};
