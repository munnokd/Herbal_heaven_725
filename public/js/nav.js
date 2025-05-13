document.addEventListener('DOMContentLoaded', function() {
    // Load navigation
    loadNavigation();

    // Load footer
    loadFooter();

    // Initialize Materialize components
    initializeMaterialize();
});

// Load Navigation
async function loadNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    
    // Get user data if logged in
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(localStorage.getItem('user')) : null;

    // Create navigation HTML
    const navHTML = `
        <nav class="green">
            <div class="nav-wrapper">
                <div class="container">
                    <a href="/" class="brand-logo">
                        <img src="/images/logo.png" alt="Herbal Heaven" height="60">
                    </a>
                    <a href="#" data-target="mobile-nav" class="sidenav-trigger">
                        <i class="material-icons">menu</i>
                    </a>
                    <ul class="right hide-on-med-and-down">
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Products</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                        ${user ? `
                            <li>
                                <a href="/cart" class="cart-link">
                                    <i class="material-icons left">shopping_cart</i>
                                    Cart
                                    <span class="cart-count new badge" data-badge-caption=""></span>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-trigger" href="#!" data-target="user-dropdown">
                                    <i class="material-icons left">person</i>
                                    ${user.name}
                                    <i class="material-icons right">arrow_drop_down</i>
                                </a>
                            </li>
                        ` : `
                            <li><a href="/login">Login</a></li>
                            <li><a href="/register" class="btn waves-effect waves-light white green-text">Sign Up</a></li>
                        `}
                    </ul>
                </div>
            </div>
        </nav>

        <!-- User Dropdown -->
        ${user ? `
            <ul id="user-dropdown" class="dropdown-content">
                <li><a href="/profile">My Profile</a></li>
                <li><a href="/orders">My Orders</a></li>
                ${user.role === 'admin' ? `
                    <li class="divider"></li>
                    <li><a href="/admin/dashboard">Admin Dashboard</a></li>
                ` : ''}
                <li class="divider"></li>
                <li><a href="#!" onclick="handleLogout()">Logout</a></li>
            </ul>
        ` : ''}

        <!-- Mobile Navigation -->
        <ul class="sidenav" id="mobile-nav">
            <li>
                <div class="user-view">
                    <div class="background green">
                        <img src="/images/nav-bg.jpg" alt="Background">
                    </div>
                    ${user ? `
                        <a href="/profile">
                            <img class="circle" src="${user.avatar || '/images/avatars/default.jpg'}" alt="User">
                        </a>
                        <a href="/profile">
                            <span class="white-text name">${user.name}</span>
                        </a>
                        <a href="/profile">
                            <span class="white-text email">${user.email}</span>
                        </a>
                    ` : `
                        <div class="center-align" style="padding: 20px;">
                            <a href="/login" class="btn-flat white-text">Login</a>
                            <a href="/register" class="btn white green-text">Sign Up</a>
                        </div>
                    `}
                </div>
            </li>
            <li><a href="/"><i class="material-icons">home</i>Home</a></li>
            <li><a href="/products"><i class="material-icons">local_florist</i>Products</a></li>
            <li><a href="/blog"><i class="material-icons">article</i>Blog</a></li>
            <li><a href="/about"><i class="material-icons">info</i>About</a></li>
            <li><a href="/contact"><i class="material-icons">mail</i>Contact</a></li>
            ${user ? `
                <li><div class="divider"></div></li>
                <li><a href="/cart"><i class="material-icons">shopping_cart</i>Cart</a></li>
                <li><a href="/profile"><i class="material-icons">person</i>My Profile</a></li>
                <li><a href="/orders"><i class="material-icons">receipt</i>My Orders</a></li>
                ${user.role === 'admin' ? `
                    <li><div class="divider"></div></li>
                    <li><a href="/admin/dashboard"><i class="material-icons">dashboard</i>Admin Dashboard</a></li>
                ` : ''}
                <li><div class="divider"></div></li>
                <li><a href="#!" onclick="handleLogout()"><i class="material-icons">exit_to_app</i>Logout</a></li>
            ` : ''}
        </ul>
    `;

    // Set navigation HTML
    navPlaceholder.innerHTML = navHTML;

    // Update cart count if user is logged in
    if (user) {
        updateCartCount();
    }
}

// Load Footer
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    const footerHTML = `
        <footer class="page-footer green">
            <div class="container">
                <div class="row">
                    <div class="col l4 s12">
                        <h5 class="white-text">Herbal Heaven</h5>
                        <p class="grey-text text-lighten-4">
                            Your trusted source for premium herbal products and natural wellness solutions.
                        </p>
                        <div class="social-links">
                            <a href="#!" class="white-text">
                                <i class="material-icons">facebook</i>
                            </a>
                            <a href="#!" class="white-text">
                                <i class="material-icons">twitter</i>
                            </a>
                            <a href="#!" class="white-text">
                                <i class="material-icons">instagram</i>
                            </a>
                        </div>
                    </div>
                    <div class="col l2 s12">
                        <h5 class="white-text">Shop</h5>
                        <ul>
                            <li><a class="grey-text text-lighten-3" href="/products">All Products</a></li>
                            <li><a class="grey-text text-lighten-3" href="/products?category=herbs">Herbs</a></li>
                            <li><a class="grey-text text-lighten-3" href="/products?category=teas">Teas</a></li>
                            <li><a class="grey-text text-lighten-3" href="/products?category=supplements">Supplements</a></li>
                        </ul>
                    </div>
                    <div class="col l2 s12">
                        <h5 class="white-text">Company</h5>
                        <ul>
                            <li><a class="grey-text text-lighten-3" href="/about">About Us</a></li>
                            <li><a class="grey-text text-lighten-3" href="/contact">Contact</a></li>
                            <li><a class="grey-text text-lighten-3" href="/blog">Blog</a></li>
                            <li><a class="grey-text text-lighten-3" href="/careers">Careers</a></li>
                        </ul>
                    </div>
                    <div class="col l4 s12">
                        <h5 class="white-text">Newsletter</h5>
                        <p class="grey-text text-lighten-4">
                            Subscribe to get updates on new products and herbal wellness tips.
                        </p>
                        <form id="footer-newsletter-form">
                            <div class="input-field">
                                <input type="email" id="footer-newsletter-email" class="white-text" required>
                                <label for="footer-newsletter-email">Your Email</label>
                            </div>
                            <button class="btn waves-effect waves-light white green-text" type="submit">
                                Subscribe
                                <i class="material-icons right">send</i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="footer-copyright">
                <div class="container">
                    © ${new Date().getFullYear()} Herbal Heaven. All rights reserved.
                    <div class="grey-text text-lighten-4 right">
                        <a class="grey-text text-lighten-4" href="/privacy">Privacy Policy</a> |
                        <a class="grey-text text-lighten-4" href="/terms">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    // Set footer HTML
    footerPlaceholder.innerHTML = footerHTML;

    // Setup newsletter form
    const newsletterForm = document.getElementById('footer-newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }
}

// Initialize Materialize Components
function initializeMaterialize() {
    // Initialize sidenav
    const sidenavElems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavElems);

    // Initialize dropdowns
    const dropdownElems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdownElems, {
        coverTrigger: false,
        constrainWidth: false
    });
}

// Update Cart Count
async function updateCartCount() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/cart', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const cart = await response.json();
        const count = cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

        // Update cart count badge
        const cartBadge = document.querySelector('.cart-count');
        if (cartBadge) {
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'block' : 'none';
        }

    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Handle Newsletter Signup
async function handleNewsletterSignup(e) {
    e.preventDefault();

    const email = document.getElementById('footer-newsletter-email').value;
    
    try {
        const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            showToast('Successfully subscribed to newsletter!');
            document.getElementById('footer-newsletter-email').value = '';
        } else {
            throw new Error('Failed to subscribe');
        }
    } catch (error) {
        console.error('Newsletter signup error:', error);
        showToast('Error subscribing to newsletter', 'red');
    }
}

// Handle Logout
async function handleLogout() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Show success message
            showToast('Successfully logged out');

            // Redirect to home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out', 'red');
    }
}

// Show Toast Message
function showToast(message, classes = 'green') {
    M.toast({
        html: message,
        classes: classes,
        displayLength: 3000
    });
}

// Export updateCartCount for use in other files
window.updateCartCount = updateCartCount; 