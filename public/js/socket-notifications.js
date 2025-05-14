// Socket.IO connection and real-time notifications
(function() {
    // Initialize socket connection
    const socket = io();
    let connected = false;

    // Connect to the socket when the user is logged in
    function connectSocket() {
        const token = localStorage.getItem('token');
        const user = token ? JSON.parse(localStorage.getItem('user')) : null;
        
        // Log connection info
        console.log('Attempting to connect to notification service');
        console.log('User is ' + (user ? 'logged in as ' + user.name : 'not logged in'));
        
        // Always join the public notifications room, regardless of auth state
        socket.emit('authenticate', user ? user._id : null);
        connected = true;
        
        // Listen for new notifications
        socket.on('new_notification', handleNewNotification);
        
        // Add connection/disconnection handlers
        socket.on('connect', () => {
            console.log('Socket connected successfully');
        });
        
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            connected = false;
        });
        
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            connected = false;
        });
        
        console.log('Connected to notification service');
    }

    // Handle new notification event
    function handleNewNotification(data) {        
        console.log('Received new notification:', data);
        
        // Update notification badge count
        updateNotificationCount();
        
        // If we're on the notifications page, update the list
        if (window.location.pathname === '/notifications.html' && typeof loadNotifications === 'function') {
            loadNotifications();
        }
        
        // Show notification toast
        showNotificationToast(data.notification);
    }

    // Update notification count in the navbar
    function updateNotificationCount() {
        if (typeof window.fetchNotifications === 'function') {
            window.fetchNotifications();
        }
    }

    // Show a toast with the notification details
    function showNotificationToast(notification) {
        const toastHTML = `
            <div class="notification-toast">
                <div class="notification-toast-title">${notification.title}</div>
                <div class="notification-toast-message">${notification.message}</div>
                <a class="btn-flat toast-action" href="${notification.link}">View</a>
            </div>
        `;
        
        M.toast({
            html: toastHTML,
            displayLength: 6000,
            classes: 'rounded green lighten-1'
        });
    }

    // Connect socket when the page loads if user is logged in
    document.addEventListener('DOMContentLoaded', connectSocket);
    
    // Reconnect socket when login state changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'token' || e.key === 'user') {
            connectSocket();
        }
    });

    // Expose functions to global scope
    window.socketNotifications = {
        connect: connectSocket,
        getStatus: () => connected,
        testConnection: () => {
            console.log('Current socket status:', connected ? 'Connected' : 'Disconnected');
            return connected;
        }
    };
})(); 