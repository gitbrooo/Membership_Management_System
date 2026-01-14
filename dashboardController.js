const Member = require('../models/Member');
const Payment = require('../models/Payment');
const Event = require('../models/Event');

exports.getStats = async (req, res) => {
  try {
    const memberStats = await Member.getStats();
    const totalRevenue = await Payment.getTotalRevenue();
    const upcomingEvents = await Event.getUpcomingCount();

    res.json({
      stats: {
        totalMembers: parseInt(memberStats.total),
        activeMembers: parseInt(memberStats.active),
        totalRevenue: parseFloat(totalRevenue),
        upcomingEvents
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
