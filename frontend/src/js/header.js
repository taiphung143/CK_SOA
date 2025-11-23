// Header.js - Handle header dynamic content and authentication state

window.API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

// Check authentication status and update header
async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const authLinksContainer = document.getElementById('auth-links');
    
    if (!authLinksContainer) return;

    if (token) {
        console.log('🔑 Token found in localStorage:', token.substring(0, 20) + '...');
        try {
            // Verify token and get user info
            console.log('📡 Fetching user profile from:', `${API_BASE_URL}/users/profile`);
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('📨 Response status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ API Response:', result);
                const userData = result.data || result;
                console.log('👤 User data:', userData);
                updateHeaderForLoggedInUser(userData);
                loadCartCount();
            } else {
                console.error('❌ Response not OK:', response.status);
                const errorData = await response.json().catch(() => ({}));
                console.error('Error details:', errorData);
                // Token invalid, clear and show login
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                updateHeaderForGuest();
            }
        } catch (error) {
            console.error('❌ Auth check failed:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            updateHeaderForGuest();
        }
    } else {
        console.log('⚠️ No token found in localStorage');
        updateHeaderForGuest();
    }
}

// Update header for logged-in user
function updateHeaderForLoggedInUser(userData) {
    console.log('🎨 Updating header for logged-in user:', userData);
    const authLinksContainer = document.getElementById('auth-links');
    if (!authLinksContainer) {
        console.error('❌ auth-links container not found in DOM!');
        return;
    }

    const isAdmin = userData.role === 'admin';
    const displayName = userData.name || userData.username || userData.email;
    console.log('👤 Display name:', displayName, '| Role:', userData.role);
    
    authLinksContainer.innerHTML = `
        <a href="${isAdmin ? '/view_admin/dashboard' : '/profile'}" class="nav-link">
            <i class="fas fa-user"></i> ${displayName}
        </a>
        <a href="/logout" class="nav-link">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    `;
    console.log('✅ Header updated successfully');
}

// Update header for guest user
function updateHeaderForGuest() {
    const authLinksContainer = document.getElementById('auth-links');
    if (!authLinksContainer) return;

    authLinksContainer.innerHTML = `
        <a href="/login" class="nav-link">
            <i class="fas fa-sign-in-alt"></i> Login
        </a>
        <a href="/register" class="nav-link">
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

// Initialize header - called after header HTML is loaded
function initializeHeader() {
    console.log('🚀 Initializing header...');
    checkAuthStatus();
    initializeSearch();
}

// Export functions for use in other scripts
window.headerAPI = {
    checkAuthStatus,
    loadCartCount,
    updateHeaderForLoggedInUser,
    updateHeaderForGuest,
    initializeHeader
};

// Auto-initialize if called directly (for backward compatibility)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
    // DOM already loaded, check if header exists
    if (document.getElementById('auth-links')) {
        initializeHeader();
    }
}
