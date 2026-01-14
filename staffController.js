const User = require('../models/User');
const { createAuditLog } = require('../middleware/auditLog');

exports.getAllStaff = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ users });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await createAuditLog(req.user.id, 'USER_UPDATE', 'user_profiles', user.id, req.body, req);
    res.json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
