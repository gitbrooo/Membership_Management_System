const express = require('express');
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/daily', reportController.getDailyStats);
router.get('/monthly', reportController.getMonthlyStats);

module.exports = router;
