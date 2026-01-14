const Member = require('../models/Member');
const { createAuditLog } = require('../middleware/auditLog');

exports.getAllMembers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const members = await Member.getAll({ status, search });
    res.json({ members });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ member });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    await createAuditLog(req.user.id, 'MEMBER_CREATE', 'members', member.id, req.body, req);
    res.status(201).json({ member, message: 'Member created successfully' });
  } catch (error) {
    console.error('Create member error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create member' });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const member = await Member.update(req.params.id, req.body);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    await createAuditLog(req.user.id, 'MEMBER_UPDATE', 'members', member.id, req.body, req);
    res.json({ member, message: 'Member updated successfully' });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.softDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    await createAuditLog(req.user.id, 'MEMBER_DELETE', 'members', member.id, {}, req);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
};

exports.getMemberStats = async (req, res) => {
  try {
    const stats = await Member.getStats();
    res.json({ stats });
  } catch (error) {
    console.error('Get member stats error:', error);
    res.status(500).json({ error: 'Failed to fetch member stats' });
  }
};
