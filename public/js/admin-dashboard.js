document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    M.Sidenav.init(document.querySelectorAll('.sidenav'));

    // Load initial data
    loadDashboardData();
    loadSalesChart();
    loadTopProducts();
    loadRecentOrders();
    loadNewUsers();
});

// Load Dashboard Summary Data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/dashboard/summary', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        // Update summary cards
        document.getElementById('total-sales').textContent = formatCurrency(data.totalSales);
        document.getElementById('total-orders').textContent = data.totalOrders;
        document.getElementById('total-users').textContent = data.totalUsers;
        document.getElementById('total-products').textContent = data.totalProducts;
        
        // Update change indicators
        updateChangeIndicator('sales-change', data.salesChange);
        updateChangeIndicator('orders-change', data.ordersChange);
        updateChangeIndicator('users-change', data.usersChange);
        document.getElementById('low-stock').textContent = `${data.lowStockCount} items low`;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard summary', 'red');
    }
}

// Load Sales Chart
async function loadSalesChart() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/dashboard/sales-chart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        const ctx = document.getElementById('sales-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sales',
                    data: data.sales,
                    borderColor: '#4CAF50',
                    tension: 0.1
                }, {
                    label: 'Orders',
                    data: data.orders,
                    borderColor: '#2196F3',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading sales chart:', error);
        showToast('Error loading sales chart', 'red');
    }
}

// Load Top Products
async function loadTopProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/dashboard/top-products', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const products = await response.json();
        
        const topProductsList = document.getElementById('top-products');
        topProductsList.innerHTML = products.map(product => `
            <li class="collection-item">
                <div class="row mb-0">
                    <div class="col s8">
                        <span class="title">${product.name}</span>
                        <p class="grey-text">${product.soldCount} sold</p>
                    </div>
                    <div class="col s4 right-align">
                        <span class="green-text">${formatCurrency(product.revenue)}</span>
                    </div>
                </div>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error loading top products:', error);
        showToast('Error loading top products', 'red');
    }
}

// Load Recent Orders
async function loadRecentOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/dashboard/recent-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await response.json();
        
        const recentOrdersTable = document.getElementById('recent-orders');
        recentOrdersTable.innerHTML = orders.map(order => `
            <tr>
                <td>${order._id}</td>
                <td>${order.user.name}</td>
                <td>${formatCurrency(order.total)}</td>
                <td>
                    <span class="status-badge ${order.status.toLowerCase()}">
                        ${order.status}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading recent orders:', error);
        showToast('Error loading recent orders', 'red');
    }
}

// Load New Users
async function loadNewUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/dashboard/new-users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await response.json();
        
        const newUsersTable = document.getElementById('new-users');
        newUsersTable.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${formatDate(user.createdAt)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading new users:', error);
        showToast('Error loading new users', 'red');
    }
}

// Update change indicator with percentage
function updateChangeIndicator(elementId, changePercentage) {
    const element = document.getElementById(elementId);
    const isPositive = changePercentage > 0;
    element.innerHTML = `
        <i class="material-icons tiny">${isPositive ? 'arrow_upward' : 'arrow_downward'}</i>
        ${Math.abs(changePercentage)}% from last month
    `;
    element.className = `change-indicator ${isPositive ? 'green-text' : 'red-text'}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show toast message
function showToast(message, classes = 'green') {
    M.toast({
        html: message,
        classes: classes,
        displayLength: 3000
    });
} 