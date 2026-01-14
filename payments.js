const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { auditLog } = require('../middleware/auditLog');

const router = express.Router();

router.use(authenticateToken);

router.get('/', paymentController.getAllPayments);
router.get('/revenue', paymentController.getTotalRevenue);
router.get('/revenue/monthly', paymentController.getRevenueByMonth);
router.get('/:id', paymentController.getPaymentById);

router.post('/',
  authorizeRoles('admin', 'staff'),
  [
    body('memberId').isUUID(),
    body('amount').isFloat({ min: 0 }),
    body('paymentMethod').isIn(['cash', 'card', 'bank_transfer', 'check', 'online']),
    body('paymentDate').isISO8601(),
    body('paymentFor').isIn(['membership', 'event', 'other']),
    body('notes').optional(),
    validate
  ],
  auditLog('CREATE', 'payments'),
  paymentController.createPayment
);

module.exports = router;
