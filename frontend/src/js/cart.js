// Cart.js - Handle shopping cart functionality

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadCart();
});

// Check if user is authenticated
function checkAuthentication() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Load cart data
async function loadCart() {
    const cartContainer = document.getElementById('cart-container');
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!cartContainer) return;

    // Show loading state
    cartContainer.innerHTML = '<div class="text-center py-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const cartData = await response.json();
            renderCart(cartData, cartContainer);
        } else {
            cartContainer.innerHTML = '<div class="alert alert-danger">Failed to load cart. Please try again.</div>';
        }
    } catch (error) {
        console.error('Failed to load cart:', error);
        cartContainer.innerHTML = '<div class="alert alert-danger">Error loading cart. Please check your connection.</div>';
    }
}

// Render cart
function renderCart(cartData, container) {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="fas fa-shopping-cart fa-5x text-muted mb-3"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <a href="home.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    let html = `
        <div class="cart-content">
            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="mb-4">Shopping Cart (${cartData.items.length} items)</h4>
                            <div class="table-responsive">
                                <table class="table cart-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
    `;

    cartData.items.forEach(item => {
        const price = item.has_discount ? 
            item.price * (1 - item.discount_percent / 100) : 
            item.price;
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        html += `
            <tr data-item-id="${item.id}">
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.product_image || '../images/default-product.jpg'}" 
                             alt="${item.product_name}" 
                             style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px;">
                        <div>
                            <h6>${item.product_name}</h6>
                            <small class="text-muted">${item.sku_name || ''}</small>
                            ${item.has_discount ? `<span class="badge bg-danger">-${item.discount_percent}%</span>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <strong>$${price.toFixed(2)}</strong>
                    ${item.has_discount ? `<br><small class="text-muted"><s>$${item.price.toFixed(2)}</s></small>` : ''}
                </td>
                <td>
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="form-control form-control-sm mx-2" value="${item.quantity}" 
                               min="1" style="width: 60px; text-align: center;" 
                               onchange="updateQuantity(${item.id}, this.value)">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td><strong>$${itemTotal.toFixed(2)}</strong></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="mb-4">Order Summary</h4>
                            <div class="d-flex justify-content-between mb-3">
                                <span>Subtotal:</span>
                                <strong>$${subtotal.toFixed(2)}</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span>Shipping:</span>
                                <strong>Free</strong>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between mb-4">
                                <h5>Total:</h5>
                                <h5 class="text-primary">$${subtotal.toFixed(2)}</h5>
                            </div>
                            <a href="checkout.html" class="btn btn-primary w-100 mb-2">
                                <i class="fas fa-lock"></i> Proceed to Checkout
                            </a>
                            <a href="home.html" class="btn btn-outline-secondary w-100">
                                Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Update item quantity
async function updateQuantity(itemId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        if (confirm('Remove this item from cart?')) {
            removeFromCart(itemId);
        }
        return;
    }

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
            loadCart(); // Reload cart
            if (window.headerAPI) {
                window.headerAPI.loadCartCount();
            }
        } else {
            alert('Failed to update quantity');
        }
    } catch (error) {
        console.error('Update quantity error:', error);
        alert('Error updating quantity');
    }
}

// Remove item from cart
async function removeFromCart(itemId) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadCart(); // Reload cart
            if (window.headerAPI) {
                window.headerAPI.loadCartCount();
            }
        } else {
            alert('Failed to remove item');
        }
    } catch (error) {
        console.error('Remove item error:', error);
        alert('Error removing item');
    }
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
