// Login.js - Handle user authentication

const API_BASE_URL = 'http://localhost:3000/api'; // API Gateway URL

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
    initializePasswordToggle();
    initializeLoginForm();
    initializePasswordResetModal();
    
    // Check if already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Redirect to home or profile
        window.location.href = 'home.html';
    }
});

// Password visibility toggle
function initializePasswordToggle() {
    const toggleButton = document.querySelector('.password-toggle');
    
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    }
}

// Initialize login form submission
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

// Handle login form submission
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const messageDiv = document.getElementById('login-message');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Get form data
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;

    // Validate inputs
    if (!username || !password) {
        showMessage(messageDiv, 'Please enter both username and password!', 'error');
        return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token
            if (rememberMe) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
            } else {
                sessionStorage.setItem('authToken', data.token);
                sessionStorage.setItem('userData', JSON.stringify(data.user));
            }

            showMessage(messageDiv, 'Login successful! Redirecting...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = '../view_admin/dashboard.html';
                } else {
                    window.location.href = 'home.html';
                }
            }, 1000);
        } else {
            const errorMessage = data.message || data.error || 'Invalid username or password!';
            showMessage(messageDiv, errorMessage, 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage(messageDiv, 'Network error. Please check your connection and try again.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
}

// Initialize password reset modal
function initializePasswordResetModal() {
    const forgotPasswordLink = document.querySelector('a[href="#"]');
    const resetModal = document.getElementById('password-reset-modal');
    const resetForm = document.getElementById('password-reset-form');
    const closeModalBtn = document.querySelector('.close-modal');

    if (forgotPasswordLink && resetModal) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            resetModal.style.display = 'flex';
        });
    }

    if (closeModalBtn && resetModal) {
        closeModalBtn.addEventListener('click', () => {
            resetModal.style.display = 'none';
        });
    }

    if (resetModal) {
        resetModal.addEventListener('click', (e) => {
            if (e.target === resetModal) {
                resetModal.style.display = 'none';
            }
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordReset);
    }
}

// Handle password reset
async function handlePasswordReset(e) {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value.trim();
    const messageDiv = document.getElementById('reset-message');
    const submitButton = e.target.querySelector('button[type="submit"]');

    if (!email) {
        showMessage(messageDiv, 'Please enter your email address!', 'error');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(messageDiv, 'Password reset link has been sent to your email!', 'success');
            e.target.reset();
            
            setTimeout(() => {
                document.getElementById('password-reset-modal').style.display = 'none';
            }, 3000);
        } else {
            showMessage(messageDiv, data.message || 'Failed to send reset link. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Password reset error:', error);
        showMessage(messageDiv, 'Network error. Please try again later.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Reset Link';
    }
}

// Show message to user
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.style.display = 'block';
    element.style.padding = '10px';
    element.style.borderRadius = '5px';
    element.style.marginBottom = '15px';
    
    if (type === 'success') {
        element.style.backgroundColor = '#d4edda';
        element.style.color = '#155724';
        element.style.border = '1px solid #c3e6cb';
    } else {
        element.style.backgroundColor = '#f8d7da';
        element.style.color = '#721c24';
        element.style.border = '1px solid #f5c6cb';
    }
}
