const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { auditLog } = require('../middleware/auditLog');

const router = express.Router();

router.use(authenticateToken);

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.get('/:id/registrations', eventController.getEventRegistrations);
router.get('/:id/attendance', eventController.getEventAttendance);

router.post('/',
  authorizeRoles('admin', 'staff'),
  [
    body('title').trim().notEmpty(),
    body('description').optional(),
    body('eventDate').isISO8601(),
    body('location').optional(),
    body('capacity').optional().isInt({ min: 0 }),
    body('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']),
    validate
  ],
  auditLog('CREATE', 'events'),
  eventController.createEvent
);

router.put('/:id',
  authorizeRoles('admin', 'staff'),
  auditLog('UPDATE', 'events'),
  eventController.updateEvent
);

router.delete('/:id',
  authorizeRoles('admin', 'staff'),
  auditLog('DELETE', 'events'),
  eventController.deleteEvent
);

router.post('/register',
  authorizeRoles('admin', 'staff'),
  [
    body('eventId').isUUID(),
    body('memberId').isUUID(),
    validate
  ],
  auditLog('REGISTER', 'event_registrations'),
  eventController.registerMember
);

router.delete('/:eventId/unregister/:memberId',
  authorizeRoles('admin', 'staff'),
  auditLog('UNREGISTER', 'event_registrations'),
  eventController.unregisterMember
);

router.post('/checkin',
  authorizeRoles('admin', 'staff'),
  [
    body('eventId').isUUID(),
    body('memberId').isUUID(),
    validate
  ],
  auditLog('CHECKIN', 'attendance'),
  eventController.checkInMember
);

module.exports = router;
