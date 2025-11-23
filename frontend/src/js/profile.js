// Profile.js - Handle user profile and orders

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

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
            renderProfile(userData.data, container);
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
        <div class="profile-main-section">
            <!-- Sidebar -->
            <div class="profile-sidebar">
                <div class="profile-img">
                    <img src="/images/default-avatar.png" alt="Profile Picture">
                </div>
                <div class="profile-name">${user.name || user.username}</div>
                <div class="profile-email">${user.email}</div>
                <div class="profile-nav">
                    <button class="profile-nav-btn active" data-tab="profile">
                        <span><i class="fas fa-user"></i> Profile Info</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <button class="profile-nav-btn" data-tab="orders">
                        <span><i class="fas fa-shopping-bag"></i> My Orders</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <button class="profile-nav-btn" data-tab="addresses">
                        <span><i class="fas fa-map-marker-alt"></i> Addresses</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <button class="profile-nav-btn" data-tab="wishlist">
                        <span><i class="fas fa-heart"></i> Wishlist</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <button class="profile-nav-btn" data-tab="settings">
                        <span><i class="fas fa-cog"></i> Settings</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            
            <!-- Content Area -->
            <div class="profile-content">
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
    
    // Add form submission handlers
    const profileForm = document.getElementById('profile-form');
    const passwordForm = document.getElementById('password-form');
    
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Render profile info
function renderProfileInfo(user) {
    return `
        <div class="content-title">Profile Information</div>
        <form id="profile-form" class="profile-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" class="form-control" value="${user.name || ''}" name="name">
            </div>
            <div class="form-group">
                <label>Username</label>
                <input type="text" class="form-control" value="${user.username}" disabled>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" value="${user.email}" name="email">
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" class="form-control" value="${user.phone_number || ''}" name="phone_number">
            </div>
            <button type="submit" class="save-btn">Update Profile</button>
        </form>
    `;
}

// Render settings
function renderSettings(user) {
    return `
        <div class="content-title">Change Password</div>
        <form id="password-form" class="profile-form">
            <div class="form-group">
                <label>Current Password</label>
                <input type="password" class="form-control" name="current_password" required>
            </div>
            <div class="form-group">
                <label>New Password</label>
                <input type="password" class="form-control" name="new_password" required>
            </div>
            <div class="form-group">
                <label>Confirm New Password</label>
                <input type="password" class="form-control" name="confirm_password" required>
            </div>
            <button type="submit" class="save-btn">Change Password</button>
        </form>
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
            const responseData = await response.json();
            renderOrders(responseData.data.orders, container);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        container.innerHTML = '<div class="alert alert-danger">Error loading orders</div>';
    }
}

// Render orders
function renderOrders(orders, container) {
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-cart"></i>
                <p>No orders found</p>
            </div>
        `;
        return;
    }

    let html = '<div class="orders-container">';
    orders.forEach(order => {
        html += `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-info">
                        <h6>Order #${order.id}</h6>
                        <div class="order-date">${new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div class="order-status ${order.status}">${order.status}</div>
                </div>
                <div class="order-total"><strong>Total:</strong> $${order.total_amount || order.total}</div>
                <button class="view-details-btn" data-order-id="${order.id}">View Details</button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    // Add event listeners to buttons
    const viewButtons = container.querySelectorAll('.view-details-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            viewOrderDetails(orderId);
        });
    });
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
window.addNewAddress = () => alert('Add address form');
window.editAddress = (id) => alert('Edit address: ' + id);
window.deleteAddress = (id) => alert('Delete address: ' + id);
window.removeFromWishlist = (id) => alert('Remove from wishlist: ' + id);

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Profile updated successfully!');
            loadUserProfile(); // Reload profile data
        } else {
            alert('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
}

// Handle password change
async function handlePasswordChange(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (data.new_password !== data.confirm_password) {
        alert('New passwords do not match');
        return;
    }
    
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                current_password: data.current_password,
                new_password: data.new_password
            })
        });
        
        if (response.ok) {
            alert('Password changed successfully!');
            e.target.reset();
        } else {
            alert('Failed to change password');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        alert('Error changing password');
    }
}

// Show order details modal
function showOrderDetailsModal(order) {
    const modalHtml = `
        <div class="modal-backdrop" id="modalBackdrop" onclick="closeOrderDetailsModal()"></div>
        <div class="order-details-modal" id="orderDetailsModal">
            <div class="modal-content">
                <!-- Order Detail Header -->
                <div class="order-detail-header">
                    <a href="#" class="back-to-orders" onclick="closeOrderDetailsModal(); return false;">
                        <i class="fas fa-arrow-left"></i> Back to Orders
                    </a>
                    <h2>Order #${order.id}</h2>
                    <button class="close-btn" onclick="closeOrderDetailsModal()">&times;</button>
                </div>

                <!-- Order Status Bar -->
                <div class="order-status-bar">
                    <div class="order-status-item active">
                        <div class="status-icon"><i class="fas fa-shopping-cart"></i></div>
                        <div class="status-text">Order Placed</div>
                    </div>
                    <div class="order-status-item ${order.status === 'paid' || order.status === 'shipped' || order.status === 'completed' ? 'active' : ''}">
                        <div class="status-icon"><i class="fas fa-credit-card"></i></div>
                        <div class="status-text">Payment</div>
                    </div>
                    <div class="order-status-item ${order.status === 'shipped' || order.status === 'completed' ? 'active' : ''}">
                        <div class="status-icon"><i class="fas fa-truck"></i></div>
                        <div class="status-text">Shipped</div>
                    </div>
                    <div class="order-status-item ${order.status === 'completed' ? 'active' : ''}">
                        <div class="status-icon"><i class="fas fa-check"></i></div>
                        <div class="status-text">Delivered</div>
                    </div>
                </div>

                <!-- Order Details Grid -->
                <div class="order-details-grid">
                    <div class="order-info-card">
                        <h5>Order Information</h5>
                        <div class="info-row">
                            <span class="info-label">Order Date:</span>
                            <span class="info-value">${new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Order Status:</span>
                            <span class="info-value order-status ${order.status}">${order.status}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Total Amount:</span>
                            <span class="info-value">$${order.total_amount || order.total}</span>
                        </div>
                    </div>

                    ${order.shipping_address ? `
                    <div class="shipping-info-card">
                        <h5>Shipping Address</h5>
                        <div class="address-info">
                            <div class="recipient-name">${order.shipping_address}</div>
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- Order Items Table -->
                <div class="order-items-table">
                    <h5>Order Items</h5>
                    <div class="table-responsive">
                        <table class="order-items">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items ? order.items.map(item => `
                                    <tr>
                                        <td>
                                            <div class="product-cell">
                                                <img src="${item.product_image || '../images/default-product.jpg'}" alt="${item.product_name}" class="product-thumbnail">
                                                <div class="product-info">
                                                    <div class="product-name">${item.product_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>$${item.price}</td>
                                        <td>${item.quantity}</td>
                                        <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="4">No items found</td></tr>'}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="text-right"><strong>Total:</strong></td>
                                    <td class="text-right"><strong>$${order.total_amount || order.total}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Close order details modal
function closeOrderDetailsModal() {
    const modal = document.getElementById('orderDetailsModal');
    const backdrop = document.getElementById('modalBackdrop');
    if (modal) {
        modal.remove();
    }
    if (backdrop) {
        backdrop.remove();
    }
}

// View order details
async function viewOrderDetails(orderId) {
    console.log('viewOrderDetails called with orderId:', orderId);
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
        alert('Please log in to view order details');
        return;
    }
    
    try {
        console.log('Fetching order details for orderId:', orderId);
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Response status:', response.status);
        if (response.ok) {
            const responseData = await response.json();
            console.log('Response data:', responseData);
            const order = responseData.data;
            console.log('Order data:', order);
            showOrderDetailsModal(order);
        } else {
            const errorText = await response.text();
            console.error('Failed to load order details:', response.status, errorText);
            alert('Failed to load order details: ' + response.status);
        }
    } catch (error) {
        console.error('Error loading order details:', error);
        alert('Error loading order details: ' + error.message);
    }
}

// Make functions globally available
window.viewOrderDetails = viewOrderDetails;
window.closeOrderDetailsModal = closeOrderDetailsModal;
