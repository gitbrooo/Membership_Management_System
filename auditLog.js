const db = require('../config/database');

const createAuditLog = async (userId, action, entityType, entityId, changes, req) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    await db.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, action, entityType, entityId, JSON.stringify(changes), ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entityId = data.id || data.data?.id || req.params.id;
        const changes = req.body;

        createAuditLog(
          req.user?.id,
          action,
          entityType,
          entityId,
          changes,
          req
        );
      }
      originalJson(data);
    };

    next();
  };
};

module.exports = { auditLog, createAuditLog };
