// Register.js - Handle user registration

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

// Initialize register page
document.addEventListener('DOMContentLoaded', () => {
    initializePasswordToggle();
    initializeRegisterForm();
});

// Password visibility toggle
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
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
    });
}

// Initialize register form submission
function initializeRegisterForm() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
}

// Handle register form submission
async function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const messageDiv = document.getElementById('register-message');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Get form data
    const formData = {
        full_name: document.getElementById('name').value.trim(),
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirm-password').value
    };

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
        showMessage(messageDiv, 'Passwords do not match!', 'error');
        return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
        showMessage(messageDiv, 'Password must be at least 6 characters long!', 'error');
        return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Registering...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: formData.full_name,
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(messageDiv, 'Registration successful! Redirecting to login...', 'success');
            
            // Clear form
            e.target.reset();
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // Handle specific error messages
            const errorMessage = data.message || data.error || 'Registration failed. Please try again.';
            showMessage(messageDiv, errorMessage, 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Register';
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage(messageDiv, 'Network error. Please check your connection and try again.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
    }
}

// Show message to user
function showMessage(element, message, type) {
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
