const Payment = require('../models/Payment');
const { createAuditLog } = require('../middleware/auditLog');

exports.getAllPayments = async (req, res) => {
  try {
    const { memberId, paymentFor, startDate, endDate } = req.query;
    const payments = await Payment.getAll({ memberId, paymentFor, startDate, endDate });
    res.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body, req.user.id);
    await createAuditLog(req.user.id, 'PAYMENT_CREATE', 'payments', payment.id, req.body, req);
    res.status(201).json({ payment, message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
};

exports.getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Payment.getTotalRevenue();
    res.json({ totalRevenue });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
};

exports.getRevenueByMonth = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const revenue = await Payment.getRevenueByMonth(months);
    res.json({ revenue });
  } catch (error) {
    console.error('Get monthly revenue error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly revenue' });
  }
};
