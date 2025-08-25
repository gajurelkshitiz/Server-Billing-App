const Notification = require('../models/notification');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { type, title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const recipientID = req.user.tokenID;
    const recipientModel = req.user.role;
    const notification = await Notification.create({
      recipientID,
      recipientModel,
      type: type || 'info',
      title,
      message,
    });
    res.status(201).json({ notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get notifications for a user/admin (with filters)
const getAllNotifications = async (req, res) => {
  try {
    const recipientID = req.user.tokenID;
    const recipientModel = req.user.role;
    // const { recipientID, recipientModel } = req.user; // set by auth middleware
    const { unread, limit = 20, skip = 0 } = req.query;
    const filter = { recipientID, recipientModel };
    if (unread === 'true') filter.readStatus = false;
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));
    res.json({ notifications, count: notifications.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { readStatus: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Not found' });
    res.json({ notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all as read for a user/admin
const markAllAsRead = async (req, res) => {
  try {
    const { recipientID, recipientModel } = req.user;
    await Notification.updateMany(
      { recipientID, recipientModel, readStatus: false },
      { $set: { readStatus: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
};