const Event = require('../models/Event');
const { createAuditLog } = require('../middleware/auditLog');

exports.getAllEvents = async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    const events = await Event.getAll({ status, upcoming: upcoming === 'true' });
    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body, req.user.id);
    await createAuditLog(req.user.id, 'EVENT_CREATE', 'events', event.id, req.body, req);
    res.status(201).json({ event, message: 'Event created successfully' });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.update(req.params.id, req.body);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await createAuditLog(req.user.id, 'EVENT_UPDATE', 'events', event.id, req.body, req);
    res.json({ event, message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.delete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await createAuditLog(req.user.id, 'EVENT_DELETE', 'events', event.id, {}, req);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

exports.registerMember = async (req, res) => {
  try {
    const { eventId, memberId } = req.body;
    const registration = await Event.registerMember(eventId, memberId);
    if (!registration) {
      return res.status(400).json({ error: 'Member already registered or event not found' });
    }
    await createAuditLog(req.user.id, 'EVENT_REGISTER', 'event_registrations', registration.id, req.body, req);
    res.status(201).json({ registration, message: 'Member registered successfully' });
  } catch (error) {
    console.error('Register member error:', error);
    res.status(500).json({ error: 'Failed to register member' });
  }
};

exports.unregisterMember = async (req, res) => {
  try {
    const { eventId, memberId } = req.params;
    const result = await Event.unregisterMember(eventId, memberId);
    if (!result) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    await createAuditLog(req.user.id, 'EVENT_UNREGISTER', 'event_registrations', null, { eventId, memberId }, req);
    res.json({ message: 'Member unregistered successfully' });
  } catch (error) {
    console.error('Unregister member error:', error);
    res.status(500).json({ error: 'Failed to unregister member' });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Event.getRegistrations(req.params.id);
    res.json({ registrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};

exports.checkInMember = async (req, res) => {
  try {
    const { eventId, memberId } = req.body;
    const attendance = await Event.checkInMember(eventId, memberId, req.user.id);
    if (!attendance) {
      return res.status(400).json({ error: 'Member already checked in or not registered' });
    }
    await createAuditLog(req.user.id, 'ATTENDANCE_CHECKIN', 'attendance', attendance.id, req.body, req);
    res.status(201).json({ attendance, message: 'Member checked in successfully' });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Failed to check in member' });
  }
};

exports.getEventAttendance = async (req, res) => {
  try {
    const attendance = await Event.getAttendance(req.params.id);
    res.json({ attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};
