const db = require('../config/database');

class Event {
  static async create(eventData, createdBy) {
    const {
      title,
      description,
      eventDate,
      location,
      capacity,
      status
    } = eventData;

    const result = await db.query(
      `INSERT INTO events (title, description, event_date, location, capacity, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, eventDate, location, capacity, status || 'upcoming', createdBy]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT e.*, u.full_name as created_by_name
       FROM events e
       LEFT JOIN user_profiles u ON e.created_by = u.id
       WHERE e.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT e.*, u.full_name as created_by_name
      FROM events e
      LEFT JOIN user_profiles u ON e.created_by = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND e.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.upcoming) {
      query += ` AND e.event_date >= CURRENT_TIMESTAMP`;
    }

    query += ' ORDER BY e.event_date ASC';

    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['title', 'description', 'event_date', 'location', 'capacity', 'status'];

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
      `UPDATE events SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM events WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async registerMember(eventId, memberId) {
    const result = await db.query(
      `INSERT INTO event_registrations (event_id, member_id)
       VALUES ($1, $2)
       ON CONFLICT (event_id, member_id) DO NOTHING
       RETURNING *`,
      [eventId, memberId]
    );

    if (result.rows.length > 0) {
      await db.query(
        'UPDATE events SET registration_count = registration_count + 1 WHERE id = $1',
        [eventId]
      );
    }

    return result.rows[0];
  }

  static async unregisterMember(eventId, memberId) {
    const result = await db.query(
      'DELETE FROM event_registrations WHERE event_id = $1 AND member_id = $2 RETURNING *',
      [eventId, memberId]
    );

    if (result.rows.length > 0) {
      await db.query(
        'UPDATE events SET registration_count = GREATEST(registration_count - 1, 0) WHERE id = $1',
        [eventId]
      );
    }

    return result.rows[0];
  }

  static async getRegistrations(eventId) {
    const result = await db.query(
      `SELECT er.*, m.first_name, m.last_name, m.email, m.phone
       FROM event_registrations er
       JOIN members m ON er.member_id = m.id
       WHERE er.event_id = $1
       ORDER BY er.registration_date DESC`,
      [eventId]
    );
    return result.rows;
  }

  static async checkInMember(eventId, memberId, recordedBy) {
    const result = await db.query(
      `INSERT INTO attendance (event_id, member_id, recorded_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (event_id, member_id) DO NOTHING
       RETURNING *`,
      [eventId, memberId, recordedBy]
    );

    if (result.rows.length > 0) {
      await db.query(
        `UPDATE event_registrations
         SET status = 'attended'
         WHERE event_id = $1 AND member_id = $2`,
        [eventId, memberId]
      );
    }

    return result.rows[0];
  }

  static async getAttendance(eventId) {
    const result = await db.query(
      `SELECT a.*, m.first_name, m.last_name, m.email
       FROM attendance a
       JOIN members m ON a.member_id = m.id
       WHERE a.event_id = $1
       ORDER BY a.check_in_time DESC`,
      [eventId]
    );
    return result.rows;
  }

  static async getUpcomingCount() {
    const result = await db.query(
      `SELECT COUNT(*) as count FROM events
       WHERE status = 'upcoming' AND event_date >= CURRENT_TIMESTAMP`
    );
    return parseInt(result.rows[0].count);
  }
}

module.exports = Event;
