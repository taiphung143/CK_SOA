// Login.js - Handle user authentication

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
    initializePasswordToggle();
    initializeLoginForm();
    initializePasswordResetModal();
    
    // Check if already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        const userData = localStorage.getItem('userData');
        try {
            const user = JSON.parse(userData);
            // Redirect based on role
            if (user && user.role === 'admin') {
                window.location.href = '/view_admin/dashboard.html';
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            // If userData parsing fails, just redirect to home
            window.location.href = '/';
        }
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
    
    const errorDiv = document.getElementById('error-message');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Get form data
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate inputs
    if (!email || !password) {
        showError('Please enter both email and password!');
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
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token and user data (API returns data.data)
            const responseData = data.data || data;
            console.log('Login response data:', responseData);
            console.log('User data:', responseData.user);
            console.log('User role:', responseData.user?.role);
            
            localStorage.setItem('authToken', responseData.token);
            localStorage.setItem('userData', JSON.stringify(responseData.user));

            hideError();
            showSuccess('Login successful! Redirecting...');
            
            console.log('🔐 Login successful! User role:', responseData.user?.role);
            console.log('📦 Storing token and user data...');
            
            // Redirect based on role
            setTimeout(() => {
                if (responseData.user && responseData.user.role === 'admin') {
                    console.log('🚀 Redirecting admin to dashboard: /view_admin/dashboard.html');
                    console.log('Current location before redirect:', window.location.href);
                    window.location.href = '/view_admin/dashboard.html';
                    console.log('Location after assignment:', window.location.href);
                } else {
                    console.log('🏠 Redirecting regular user to home');
                    window.location.href = '/';
                }
            }, 1000);
        } else {
            const errorMessage = data.message || data.error || 'Invalid email or password!';
            showError(errorMessage);
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Network error. Please check your connection and try again.');
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

// Helper functions for error display
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function showSuccess(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'green';
    }
}
