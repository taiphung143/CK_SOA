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
                <input type="email" class="form-control" value="${user.email}" name="email" disabled>
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
            renderAddresses(addresses.data, container);
        }
    } catch (error) {
        console.error('Failed to load addresses:', error);
    }
}

// Render addresses
function renderAddresses(addresses, container) {
    let html = `
        <div class="address-section">
            <div class="address-header">
                <div class="address-title-section">
                    <div class="address-icon-wrapper">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="address-title-content">
                        <h3>My Addresses</h3>
                        <p class="address-subtitle">Manage your delivery addresses</p>
                    </div>
                </div>
                <button class="add-address-btn" onclick="addNewAddress()">
                    <i class="fas fa-plus-circle"></i>
                    <span>Add New Address</span>
                </button>
            </div>

            <div class="address-stats">
                <div class="stat-item">
                    <div class="stat-number">${addresses ? addresses.length : 0}</div>
                    <div class="stat-label">Total Addresses</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${addresses ? addresses.filter(addr => addr.is_default).length : 0}</div>
                    <div class="stat-label">Default Address</div>
                </div>
            </div>

            <div class="address-list">
    `;

    if (!addresses || addresses.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-map-marked-alt empty-icon"></i>
                <p>No addresses yet. Add your first delivery address to make checkout faster and easier.</p>
            </div>
        `;
    } else {
        addresses.forEach((addr, index) => {
            const isDefault = addr.is_default;
            html += `
                <div class="address-card ${isDefault ? 'default-address' : ''}" style="animation-delay: ${index * 0.1}s">
                    ${isDefault ? `
                        <div class="default-badge">
                            <i class="fas fa-star"></i>
                            Default
                        </div>
                    ` : ''}

                    <div class="address-info">
                        <h5>${addr.recipient_name}</h5>
                        <p><strong>Phone:</strong> ${addr.phone}</p>
                        <p><strong>Address:</strong> ${addr.street_address}</p>
                        <p><strong>Location:</strong> ${addr.city}, ${addr.state} ${addr.postal_code}, ${addr.country}</p>
                    </div>

                    <div class="address-actions">
                        <a href="#" class="edit-address-btn" onclick="editAddress(${addr.id}); return false;">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        ${!isDefault ? `
                            <a href="#" class="make-default-btn" onclick="setDefaultAddress(${addr.id}); return false;">
                                <i class="fas fa-star"></i> Make Default
                            </a>
                        ` : ''}
                        ${!isDefault ? `
                            <a href="#" class="delete-address-btn" onclick="deleteAddress(${addr.id}); return false;">
                                <i class="fas fa-trash"></i> Delete
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }

    html += `
            </div>

            <!-- Add New Address Section -->
            <div class="add-new-section" id="add-address-section" style="display: none;">
                <h5 id="address-form-title">Add New Address</h5>
                <form class="address-form" id="address-form">
                    <input type="hidden" id="address_id" name="address_id">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="recipient_name">Full Name *</label>
                            <input type="text" class="form-control" id="recipient_name" name="recipient_name" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number *</label>
                            <input type="tel" class="form-control" id="phone" name="phone" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="street_address">Street Address *</label>
                        <input type="text" class="form-control" id="street_address" name="street_address" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City *</label>
                            <input type="text" class="form-control" id="city" name="city" required>
                        </div>
                        <div class="form-group">
                            <label for="state">State/Province *</label>
                            <input type="text" class="form-control" id="state" name="state" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="postal_code">Postal Code *</label>
                            <input type="text" class="form-control" id="postal_code" name="postal_code" required>
                        </div>
                        <div class="form-group">
                            <label for="country">Country *</label>
                            <input type="text" class="form-control" id="country" name="country" required>
                        </div>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="is_default" name="is_default">
                        <label class="form-check-label" for="is_default">Set as default address</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-save" id="address-submit-btn">Add Address</button>
                        <button type="button" class="btn-cancel" onclick="cancelAddAddress()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    container.innerHTML = html;

    // Add form submission handler
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', handleAddressSubmit);
    }
}

// Load wishlist
async function loadWishlist() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const container = document.getElementById('wishlist-container');

    try {
        const response = await fetch(`${API_BASE_URL}/wishlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const wishlist = await response.json();
            renderWishlist(wishlist.data, container);
        }
    } catch (error) {
        console.error('Failed to load wishlist:', error);
    }
}

// Render wishlist
function renderWishlist(items, container) {
    let html = `
        <div class="wishlist-section">
            <div class="wishlist-header">
                <div class="wishlist-title-section">
                    <div class="wishlist-icon-wrapper">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="wishlist-title-content">
                        <h3>My Wishlist</h3>
                        <p class="wishlist-subtitle">Products you've saved for later</p>
                    </div>
                </div>
            </div>

            <div class="wishlist-stats">
                <div class="stat-item">
                    <div class="stat-number">${items ? items.length : 0}</div>
                    <div class="stat-label">Saved Items</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${items ? items.filter(item => item.price > 0).length : 0}</div>
                    <div class="stat-label">Available Products</div>
                </div>
            </div>

            <div class="wishlist-grid">
    `;

    if (!items || items.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-heart-broken empty-icon"></i>
                <p>Your wishlist is empty. Start browsing and save your favorite products!</p>
                <a href="/" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
    } else {
        items.forEach((item, index) => {
            html += `
                <div class="wishlist-card" style="animation-delay: ${index * 0.1}s">
                    <div class="wishlist-image-container">
                        <img src="${item.product_image || '../images/default-product.jpg'}" alt="${item.product_name}" class="wishlist-image">
                        <button class="remove-wishlist-btn" onclick="removeFromWishlist(${item.id})" title="Remove from wishlist">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="wishlist-info">
                        <h5 class="wishlist-product-name">${item.product_name}</h5>
                        <div class="wishlist-price">$${item.price ? item.price.toLocaleString() : 'N/A'}</div>
                        <div class="wishlist-added-date">Added ${new Date(item.added_at).toLocaleDateString()}</div>
                    </div>

                    <div class="wishlist-actions">
                        <button class="wishlist-btn wishlist-btn-primary" onclick="addToCart(${item.product_id})">
                            <i class="fas fa-cart-plus"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    html += `
            </div>
        </div>
    `;
    container.innerHTML = html;
}

// Make functions globally available
window.switchTab = switchTab;
window.addNewAddress = addNewAddress;
window.editAddress = editAddress;
window.deleteAddress = deleteAddress;
window.setDefaultAddress = setDefaultAddress;
window.cancelAddAddress = cancelAddAddress;
window.removeFromWishlist = removeFromWishlist;
window.addToCart = addToCart;

// Address management functions
function addNewAddress() {
    const addSection = document.getElementById('add-address-section');
    if (addSection) {
        addSection.style.display = 'block';
        addSection.scrollIntoView({ behavior: 'smooth' });
    }
}

async function editAddress(addressId) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/addresses/${addressId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const addressData = await response.json();
            const address = addressData.data;
            
            // Populate form with address data
            document.getElementById('address_id').value = address.id;
            document.getElementById('recipient_name').value = address.recipient_name;
            document.getElementById('phone').value = address.phone;
            document.getElementById('street_address').value = address.street_address;
            document.getElementById('city').value = address.city;
            document.getElementById('state').value = address.state;
            document.getElementById('postal_code').value = address.postal_code;
            document.getElementById('country').value = address.country;
            document.getElementById('is_default').checked = address.is_default;
            
            // Update form title and button
            document.getElementById('address-form-title').textContent = 'Edit Address';
            document.getElementById('address-submit-btn').textContent = 'Update Address';
            
            // Show form
            const addSection = document.getElementById('add-address-section');
            if (addSection) {
                addSection.style.display = 'block';
                addSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            alert('Failed to load address for editing');
        }
    } catch (error) {
        console.error('Error loading address:', error);
        alert('Error loading address for editing');
    }
}

async function deleteAddress(addressId) {
    if (!confirm('Are you sure you want to delete this address?')) {
        return;
    }

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/users/addresses/${addressId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Address deleted successfully!');
            loadAddresses(); // Reload addresses
        } else {
            const error = await response.json();
            alert('Failed to delete address: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting address:', error);
        alert('Error deleting address');
    }
}

async function setDefaultAddress(addressId) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/users/addresses/${addressId}/set-default`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Address set as default successfully!');
            loadAddresses(); // Reload addresses
        } else {
            const error = await response.json();
            alert('Failed to set default address: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error setting default address:', error);
        alert('Error setting default address');
    }
}

function cancelAddAddress() {
    const addSection = document.getElementById('add-address-section');
    const form = document.getElementById('address-form');
    if (addSection) {
        addSection.style.display = 'none';
    }
    if (form) {
        form.reset();
        // Reset form title and button to default
        document.getElementById('address-form-title').textContent = 'Add New Address';
        document.getElementById('address-submit-btn').textContent = 'Add Address';
        document.getElementById('address_id').value = '';
    }
}

async function handleAddressSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Build clean data object
    const data = {
        recipient_name: formData.get('recipient_name')?.trim() || '',
        phone: formData.get('phone')?.trim() || '',
        street_address: formData.get('street_address')?.trim() || '',
        city: formData.get('city')?.trim() || '',
        state: formData.get('state')?.trim() || '',
        postal_code: formData.get('postal_code')?.trim() || '',
        country: formData.get('country')?.trim() || 'Vietnam',
        is_default: formData.get('is_default') === 'on'
    };

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const isEdit = document.getElementById('address_id').value.trim() !== '';

    try {
        const url = isEdit 
            ? `${API_BASE_URL}/users/addresses/${document.getElementById('address_id').value}`
            : `${API_BASE_URL}/users/addresses`;
        
        const method = isEdit ? 'PUT' : 'POST';

        console.log('Sending request:', { method, url, data });

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('Response data:', result);
            const message = isEdit ? 'Address updated successfully!' : 'Address added successfully!';
            alert(message);
            cancelAddAddress();
            loadAddresses(); // Reload addresses
        } else {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            try {
                const error = JSON.parse(errorText);
                alert(`Failed to ${isEdit ? 'update' : 'add'} address: ` + (error.message || 'Unknown error'));
            } catch {
                alert(`Failed to ${isEdit ? 'update' : 'add'} address: ${errorText}`);
            }
        }
    } catch (error) {
        console.error(`Error ${isEdit ? 'updating' : 'adding'} address:`, error);
        alert(`Error ${isEdit ? 'updating' : 'adding'} address`);
    }
}

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
        <div class="modal-backdrop-order" id="modalBackdrop" onclick="closeOrderDetailsModal()"></div>
        <div class="order-details-modal" id="orderDetailsModal">
            <div class="modal-content-order">
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

// Remove item from wishlist
async function removeFromWishlist(wishlistId) {
    if (!confirm('Are you sure you want to remove this item from your wishlist?')) {
        return;
    }

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/wishlist/${wishlistId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Item removed from wishlist successfully!');
            loadWishlist(); // Reload wishlist
        } else {
            const error = await response.json();
            alert('Failed to remove item: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        alert('Error removing item from wishlist');
    }
}

// Add item to cart
async function addToCart(productId) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });

        if (response.ok) {
            alert('Product added to cart!');
            // Update cart count in header if available
            if (window.headerAPI && window.headerAPI.loadCartCount) {
                window.headerAPI.loadCartCount();
            }
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        alert('Error adding to cart. Please try again.');
    }
}

// Make functions globally available
window.viewOrderDetails = viewOrderDetails;
window.closeOrderDetailsModal = closeOrderDetailsModal;
