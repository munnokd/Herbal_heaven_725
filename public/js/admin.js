document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Modal.init(document.querySelectorAll('.modal'));

    // Check admin authentication
    checkAdminAuth();

    // Load dashboard data
    loadDashboardData();

    // Setup event listeners
    setupEventListeners();
});

// Authentication check
async function checkAdminAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (!response.ok || !data.user || data.user.role !== 'admin') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
            return;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch statistics
        const stats = await fetch('/api/admin/stats', { headers }).then(res => res.json());
        updateDashboardStats(stats);

        // Fetch recent orders
        const orders = await fetch('/api/orders/admin/all?limit=5', { headers }).then(res => res.json());
        displayRecentOrders(orders);

        // Fetch low stock products
        const products = await fetch('/api/products/low-stock', { headers }).then(res => res.json());
        displayLowStockProducts(products);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard data', 'red');
    }
}

// Update Dashboard Statistics
function updateDashboardStats(stats) {
    document.getElementById('total-orders').textContent = stats.totalOrders;
    document.getElementById('total-revenue').textContent = formatCurrency(stats.totalRevenue);
    document.getElementById('total-products').textContent = stats.totalProducts;
    document.getElementById('total-users').textContent = stats.totalUsers;
}

// Display Recent Orders
function displayRecentOrders(orders) {
    const tbody = document.getElementById('recent-orders');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order._id}</td>
            <td>${order.user.name}</td>
            <td>${formatCurrency(order.totalAmount)}</td>
            <td>
                <select class="order-status" data-order-id="${order._id}">
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn-small view-order" data-order-id="${order._id}">
                    <i class="material-icons">visibility</i>
                </button>
            </td>
        </tr>
    `).join('');

    // Initialize status dropdowns
    M.FormSelect.init(document.querySelectorAll('select'));
}

// Display Low Stock Products
function displayLowStockProducts(products) {
    const tbody = document.getElementById('low-stock');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-small update-stock" data-product-id="${product._id}">
                    <i class="material-icons">add</i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // Logout
    document.querySelectorAll('#logout, #mobile-logout').forEach(button => {
        button.addEventListener('click', handleLogout);
    });

    // Order status change
    document.addEventListener('change', async function(e) {
        if (e.target.classList.contains('order-status')) {
            await updateOrderStatus(e.target.dataset.orderId, e.target.value);
        }
    });

    // View order details
    document.addEventListener('click', async function(e) {
        if (e.target.closest('.view-order')) {
            const orderId = e.target.closest('.view-order').dataset.orderId;
            await showOrderDetails(orderId);
        }
    });

    // Update stock
    document.addEventListener('click', async function(e) {
        if (e.target.closest('.update-stock')) {
            const productId = e.target.closest('.update-stock').dataset.productId;
            await showUpdateStockModal(productId);
        }
    });
}

// Handle Logout
async function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Update Order Status
async function updateOrderStatus(orderId, status) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/orders/admin/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            showToast('Order status updated successfully');
        } else {
            throw new Error('Failed to update order status');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showToast('Error updating order status', 'red');
    }
}

// Show Order Details Modal
async function showOrderDetails(orderId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const order = await response.json();

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h4>Order Details</h4>
                <p>Order ID: ${order._id}</p>
                <p>Customer: ${order.user.name}</p>
                <p>Total: ${formatCurrency(order.totalAmount)}</p>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <p>${item.product.name} x ${item.quantity}</p>
                            <p>${formatCurrency(item.priceAtPurchase)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-close waves-effect waves-green btn-flat">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
        const modalInstance = M.Modal.init(modal);
        modalInstance.open();
    } catch (error) {
        console.error('Error fetching order details:', error);
        showToast('Error fetching order details', 'red');
    }
}

// Show Update Stock Modal
async function showUpdateStockModal(productId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h4>Update Stock</h4>
            <div class="input-field">
                <input type="number" id="stock-quantity" min="0">
                <label for="stock-quantity">New Stock Quantity</label>
            </div>
        </div>
        <div class="modal-footer">
            <button class="modal-close waves-effect waves-green btn-flat">Cancel</button>
            <button class="waves-effect waves-green btn" onclick="updateStock('${productId}')">Update</button>
        </div>
    `;

    document.body.appendChild(modal);
    const modalInstance = M.Modal.init(modal);
    modalInstance.open();
}

// Update Product Stock
async function updateStock(productId) {
    try {
        const quantity = document.getElementById('stock-quantity').value;
        const token = localStorage.getItem('token');

        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ stock: quantity })
        });

        if (response.ok) {
            showToast('Stock updated successfully');
            loadDashboardData(); // Refresh dashboard data
        } else {
            throw new Error('Failed to update stock');
        }
    } catch (error) {
        console.error('Error updating stock:', error);
        showToast('Error updating stock', 'red');
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    }).format(amount);
}

function showToast(message, classes = 'green') {
    M.toast({
        html: message,
        classes: classes,
        displayLength: 3000
    });
} 