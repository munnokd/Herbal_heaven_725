document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
    M.Modal.init(document.querySelectorAll('.modal'));

    // Check authentication status
    checkAuth();

    // Event listeners
    setupEventListeners();
});

// Authentication check
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showLoggedInUI();
            } else {
                showLoggedOutUI();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            showLoggedOutUI();
        }
    } else {
        showLoggedOutUI();
    }
}

// UI State Management
function showLoggedInUI() {
    document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'block');
    document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'none');
}

function showLoggedOutUI() {
    document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'none');
    document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'block');
}

// Event Listeners Setup
function setupEventListeners() {
    // Logout
    document.querySelectorAll('#logout').forEach(button => {
        button.addEventListener('click', handleLogout);
    });

    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Search Products
    const searchForm = document.querySelector('#search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}

// API Handlers
async function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    showLoggedOutUI();
    window.location.href = '/';
}

async function handleAddToCart(e) {
    e.preventDefault();
    const productId = e.target.dataset.productId;
    const token = localStorage.getItem('token');

    if (!token) {
        M.toast({html: 'Please login to add items to cart'});
        return;
    }

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        if (response.ok) {
            M.toast({html: 'Item added to cart'});
        } else {
            throw new Error('Failed to add item');
        }
    } catch (error) {
        M.toast({html: 'Error adding item to cart'});
    }
}

async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = document.querySelector('#search-input').value;
    window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
}

// Payment Integration
let stripe = null;
let elements = null;

async function initializeStripe() {
    const response = await fetch('/api/payment/config');
    const { publishableKey } = await response.json();
    stripe = Stripe(publishableKey);
    elements = stripe.elements();

    const card = elements.create('card');
    card.mount('#card-element');

    card.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

// Toast Message Helper
function showToast(message, classes = 'green') {
    M.toast({
        html: message,
        classes: classes,
        displayLength: 3000
    });
}

// Error Handler
function handleError(error) {
    console.error('Error:', error);
    showToast(error.message || 'An error occurred', 'red');
} 