const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Get user notifications
router.get('/', auth, notificationController.getUserNotifications);

// Get unread count
router.get('/unread-count', auth, notificationController.getUnreadCount);

// Mark notification as read
router.put('/:id/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', auth, notificationController.markAllAsRead);

// Create notification (admin only)
router.post('/', auth, (req, res, next) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
}, notificationController.createNotification);

module.exports = router; 