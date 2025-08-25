const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');

// Create notification (for admin use, or system events)
router.post('/', notificationController.createNotification);

// Get notifications for current user/admin
router.get('/', notificationController.getAllNotifications);

// Mark a notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all as read
router.patch('/read-all', notificationController.markAllAsRead);

// Delete a notification
// router.delete('/:id', notificationController.deleteNotification);

// Clear all notifications
// router.delete('/clear/all', notificationController.clearAll);

module.exports = router;
