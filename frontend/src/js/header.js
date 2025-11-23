// Header.js - Handle header dynamic content and authentication state

const API_BASE_URL = 'http://localhost:3000/api'; // API Gateway URL

// Check authentication status and update header
async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const authLinksContainer = document.getElementById('auth-links');
    
    if (!authLinksContainer) return;

    if (token) {
        try {
            // Verify token and get user info
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                updateHeaderForLoggedInUser(userData);
                loadCartCount();
            } else {
                // Token invalid, clear and show login
                localStorage.removeItem('authToken');
                updateHeaderForGuest();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            updateHeaderForGuest();
        }
    } else {
        updateHeaderForGuest();
    }
}

// Update header for logged-in user
function updateHeaderForLoggedInUser(userData) {
    const authLinksContainer = document.getElementById('auth-links');
    if (!authLinksContainer) return;

    const isAdmin = userData.role === 'admin';
    
    authLinksContainer.innerHTML = `
        <a href="${isAdmin ? 'view_admin/dashboard.html' : 'profile.html'}" class="nav-link">
            <i class="fas fa-user"></i> ${userData.username || userData.email}
        </a>
        <a href="logout.html" class="nav-link">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    `;
}

// Update header for guest user
function updateHeaderForGuest() {
    const authLinksContainer = document.getElementById('auth-links');
    if (!authLinksContainer) return;

    authLinksContainer.innerHTML = `
        <a href="login.html" class="nav-link">
            <i class="fas fa-sign-in-alt"></i> Login
        </a>
        <a href="register.html" class="nav-link">
            <i class="fas fa-user-plus"></i> Register
        </a>
    `;
}

// Load cart item count
async function loadCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
        cartCountElement.textContent = '0';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const cartData = await response.json();
            const itemCount = cartData.items ? cartData.items.length : 0;
            cartCountElement.textContent = itemCount;
        }
    } catch (error) {
        console.error('Failed to load cart count:', error);
        cartCountElement.textContent = '0';
    }
}

// Search functionality
function initializeSearch() {
    const searchForm = document.querySelector('.search-box form');
    const searchInput = document.querySelector('.search-box input');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `category.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}

// Initialize header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    initializeSearch();
});

// Export functions for use in other scripts
window.headerAPI = {
    checkAuthStatus,
    loadCartCount,
    updateHeaderForLoggedInUser,
    updateHeaderForGuest
};
