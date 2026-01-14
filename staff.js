const express = require('express');
const staffController = require('../controllers/staffController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/', staffController.getAllStaff);
router.put('/:id', auditLog('UPDATE', 'user_profiles'), staffController.updateStaff);

module.exports = router;
