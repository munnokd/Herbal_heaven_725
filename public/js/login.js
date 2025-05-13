document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/';
        return;
    }

    // Setup form submission handler
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                rememberMe
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.token);
            
            // Store user data if remember me is checked
            if (rememberMe) {
                localStorage.setItem('user', JSON.stringify({
                    id: data.user._id,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role
                }));
            }

            // Redirect based on role
            if (data.user.role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                // Redirect to the page they were trying to access, or home
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
                window.location.href = redirectUrl || '/';
            }
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed. Please check your credentials.', 'red');
    }
}

function showToast(message, classes = 'red') {
    M.toast({
        html: message,
        classes: classes,
        displayLength: 3000
    });
} 