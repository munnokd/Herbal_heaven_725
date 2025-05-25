const { Notification, User } = require('../models/Project');

// Get all notifications for current user
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [
                { user: req.user._id },
                { user: null } // public notifications
            ]
        }).sort({ createdAt: -1 }).limit(20);

        res.json(notifications);
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ message: 'Error getting notifications' });
    }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            $or: [
                { user: req.user._id, isRead: false },
                { user: null, isRead: false } // public notifications
            ]
        });

        res.json({ count });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ message: 'Error getting unread count' });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Notification.findByIdAndUpdate(id, { isRead: true });
        
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { 
                $or: [
                    { user: req.user._id },
                    { user: null } // public notifications
                ],
                isRead: false
            }, 
            { isRead: true }
        );
        
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Error marking all notifications as read' });
    }
};

// Create a new notification (admin only)
exports.createNotification = async (req, res) => {
    try {
        const { type, title, message, image, link, userId } = req.body;
        
        const notification = new Notification({
            type,
            title,
            message,
            image,
            link,
            user: userId || null // if userId is not provided, it's a public notification
        });
        
        await notification.save();
        
        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Error creating notification' });
    }
};

// Helper function to create product notification (for internal use)
exports.createProductNotification = async (product) => {
    try {
        const notification = new Notification({
            type: 'product',
            title: 'New Product Added',
            message: `${product.name} has been added to our store!`,
            image: product.images && product.images.length > 0 ? product.images[0] : null,
            link: `/product-detail.html?id=${product._id}`,
            user: null // public notification
        });
        
        await notification.save();
        
        // Emit socket event for real-time notification
        const io = global.io;
        if (io) {
            console.log('Emitting new_notification event to public_notifications room');
            io.to("public_notifications").emit("new_notification", {
                notification: {
                    _id: notification._id,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    image: notification.image,
                    link: notification.link,
                    createdAt: notification.createdAt
                },
                count: 1 // Incremental count
            });
            
            // Also broadcast to all connected clients to ensure delivery
            io.emit("new_notification", {
                notification: {
                    _id: notification._id,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    image: notification.image,
                    link: notification.link,
                    createdAt: notification.createdAt
                },
                count: 1 // Incremental count
            });
        } else {
            console.error('Socket.IO instance not available');
        }
        
        return notification;
    } catch (error) {
        console.error('Error creating product notification:', error);
        throw error;
    }
}; 