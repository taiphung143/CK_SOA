// Profile.js - Handle user profile and orders

const API_BASE_URL = 'http://localhost:3000/api'; // API Gateway URL

let userData = null;

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadUserProfile();
    initializeTabs();
});

// Check authentication
function checkAuthentication() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Initialize tabs
function initializeTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Switch tabs
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    // Update active tab button
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // Load data for specific tabs
    if (tabName === 'orders') {
        loadOrders();
    } else if (tabName === 'addresses') {
        loadAddresses();
    } else if (tabName === 'wishlist') {
        loadWishlist();
    }
}

// Load user profile
async function loadUserProfile() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const container = document.getElementById('profile-container');

    try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            userData = await response.json();
            renderProfile(userData, container);
        } else {
            container.innerHTML = '<div class="alert alert-danger">Failed to load profile</div>';
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
        container.innerHTML = '<div class="alert alert-danger">Error loading profile</div>';
    }
}

// Render profile
function renderProfile(user, container) {
    let html = `
        <div class="row">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body text-center">
                        <i class="fas fa-user-circle fa-5x text-primary mb-3"></i>
                        <h5>${user.full_name || user.username}</h5>
                        <p class="text-muted">${user.email}</p>
                    </div>
                    <div class="list-group list-group-flush">
                        <a href="#" class="list-group-item list-group-item-action active" data-tab="profile">
                            <i class="fas fa-user"></i> Profile Info
                        </a>
                        <a href="#" class="list-group-item list-group-item-action" data-tab="orders">
                            <i class="fas fa-shopping-bag"></i> My Orders
                        </a>
                        <a href="#" class="list-group-item list-group-item-action" data-tab="addresses">
                            <i class="fas fa-map-marker-alt"></i> Addresses
                        </a>
                        <a href="#" class="list-group-item list-group-item-action" data-tab="wishlist">
                            <i class="fas fa-heart"></i> Wishlist
                        </a>
                        <a href="#" class="list-group-item list-group-item-action" data-tab="settings">
                            <i class="fas fa-cog"></i> Settings
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <!-- Profile Tab -->
                <div id="profile-tab" class="tab-content">
                    ${renderProfileInfo(user)}
                </div>
                
                <!-- Orders Tab -->
                <div id="orders-tab" class="tab-content" style="display:none;">
                    <div id="orders-container">Loading...</div>
                </div>
                
                <!-- Addresses Tab -->
                <div id="addresses-tab" class="tab-content" style="display:none;">
                    <div id="addresses-container">Loading...</div>
                </div>
                
                <!-- Wishlist Tab -->
                <div id="wishlist-tab" class="tab-content" style="display:none;">
                    <div id="wishlist-container">Loading...</div>
                </div>
                
                <!-- Settings Tab -->
                <div id="settings-tab" class="tab-content" style="display:none;">
                    ${renderSettings(user)}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    initializeTabs();
}

// Render profile info
function renderProfileInfo(user) {
    return `
        <div class="card">
            <div class="card-header">
                <h5>Profile Information</h5>
            </div>
            <div class="card-body">
                <form id="profile-form">
                    <div class="mb-3">
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-control" value="${user.full_name || ''}" name="full_name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Username</label>
                        <input type="text" class="form-control" value="${user.username}" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" value="${user.email}" name="email">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" value="${user.phone_number || ''}" name="phone_number">
                    </div>
                    <button type="submit" class="btn btn-primary">Update Profile</button>
                </form>
            </div>
        </div>
    `;
}

// Render settings
function renderSettings(user) {
    return `
        <div class="card">
            <div class="card-header">
                <h5>Change Password</h5>
            </div>
            <div class="card-body">
                <form id="password-form">
                    <div class="mb-3">
                        <label class="form-label">Current Password</label>
                        <input type="password" class="form-control" name="current_password" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">New Password</label>
                        <input type="password" class="form-control" name="new_password" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" name="confirm_password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Change Password</button>
                </form>
            </div>
        </div>
    `;
}

// Load orders
async function loadOrders() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const container = document.getElementById('orders-container');

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const orders = await response.json();
            renderOrders(orders, container);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        container.innerHTML = '<div class="alert alert-danger">Error loading orders</div>';
    }
}

// Render orders
function renderOrders(orders, container) {
    if (!orders || orders.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No orders found</div>';
        return;
    }

    let html = '<div class="card"><div class="card-body">';
    orders.forEach(order => {
        html += `
            <div class="order-item border-bottom pb-3 mb-3">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6>Order #${order.id}</h6>
                        <small class="text-muted">${new Date(order.created_at).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span>
                    </div>
                </div>
                <p class="mb-1"><strong>Total:</strong> $${order.total}</p>
                <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetails(${order.id})">View Details</button>
            </div>
        `;
    });
    html += '</div></div>';
    container.innerHTML = html;
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'paid': 'info',
        'shipped': 'primary',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

// Load addresses
async function loadAddresses() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const container = document.getElementById('addresses-container');

    try {
        const response = await fetch(`${API_BASE_URL}/users/addresses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const addresses = await response.json();
            renderAddresses(addresses, container);
        }
    } catch (error) {
        console.error('Failed to load addresses:', error);
    }
}

// Render addresses
function renderAddresses(addresses, container) {
    let html = `
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <h5>My Addresses</h5>
                <button class="btn btn-primary btn-sm" onclick="addNewAddress()">Add New</button>
            </div>
            <div class="card-body">
    `;

    if (!addresses || addresses.length === 0) {
        html += '<p>No addresses found</p>';
    } else {
        addresses.forEach(addr => {
            html += `
                <div class="address-item border p-3 mb-3">
                    <h6>${addr.recipient_name} ${addr.is_default ? '<span class="badge bg-primary">Default</span>' : ''}</h6>
                    <p>${addr.phone_number}</p>
                    <p>${addr.address_line}, ${addr.city}, ${addr.state} ${addr.postal_code}</p>
                    <button class="btn btn-sm btn-outline-primary" onclick="editAddress(${addr.id})">Edit</button>
                    ${!addr.is_default ? `<button class="btn btn-sm btn-outline-danger" onclick="deleteAddress(${addr.id})">Delete</button>` : ''}
                </div>
            `;
        });
    }

    html += '</div></div>';
    container.innerHTML = html;
}

// Load wishlist
async function loadWishlist() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const container = document.getElementById('wishlist-container');

    try {
        const response = await fetch(`${API_BASE_URL}/cart/wishlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const wishlist = await response.json();
            renderWishlist(wishlist, container);
        }
    } catch (error) {
        console.error('Failed to load wishlist:', error);
    }
}

// Render wishlist
function renderWishlist(items, container) {
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No items in wishlist</div>';
        return;
    }

    let html = '<div class="row">';
    items.forEach(item => {
        html += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="${item.product_image || '../images/default-product.jpg'}" class="card-img-top" alt="${item.product_name}">
                    <div class="card-body">
                        <h6>${item.product_name}</h6>
                        <p><strong>$${item.price}</strong></p>
                        <button class="btn btn-sm btn-primary" onclick="addToCart(${item.product_id})">Add to Cart</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromWishlist(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// Make functions globally available
window.switchTab = switchTab;
window.viewOrderDetails = (id) => alert('Order details: ' + id);
window.addNewAddress = () => alert('Add address form');
window.editAddress = (id) => alert('Edit address: ' + id);
window.deleteAddress = (id) => alert('Delete address: ' + id);
window.removeFromWishlist = (id) => alert('Remove from wishlist: ' + id);
