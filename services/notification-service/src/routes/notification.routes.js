const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const preferenceController = require('../controllers/preference.controller');

// Send notification
router.post('/send', notificationController.send);

// Trigger event-based notification
router.post('/trigger-event', notificationController.triggerEvent);

// Get user notifications (in-app)
router.get('/user', notificationController.getUserNotifications);

// Mark as read
router.put('/:id/read', notificationController.markAsRead);

// Get statistics
router.get('/stats', notificationController.getStats);

// User preferences
router.get('/preferences', preferenceController.getUserPreferences);
router.put('/preferences', preferenceController.updatePreferences);

module.exports = router;
