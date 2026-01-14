const express = require('express');
const { body } = require('express-validator');
const memberController = require('../controllers/memberController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { auditLog } = require('../middleware/auditLog');

const router = express.Router();

router.use(authenticateToken);

router.get('/', memberController.getAllMembers);
router.get('/stats', memberController.getMemberStats);
router.get('/:id', memberController.getMemberById);

router.post('/',
  authorizeRoles('admin', 'staff'),
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional(),
    body('address').optional(),
    body('membershipPlanId').optional().isUUID(),
    body('status').optional().isIn(['active', 'inactive', 'expired']),
    body('joinDate').optional().isISO8601(),
    body('expiryDate').optional().isISO8601(),
    validate
  ],
  auditLog('CREATE', 'members'),
  memberController.createMember
);

router.put('/:id',
  authorizeRoles('admin', 'staff'),
  auditLog('UPDATE', 'members'),
  memberController.updateMember
);

router.delete('/:id',
  authorizeRoles('admin', 'staff'),
  auditLog('DELETE', 'members'),
  memberController.deleteMember
);

module.exports = router;
