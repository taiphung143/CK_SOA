// Checkout.js - Handle checkout process

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

let cartData = null;
let selectedAddress = null;
let selectedPaymentMethod = 'cod';

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadCheckoutData();
});

// Check authentication
function checkAuthentication() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Load checkout data
async function loadCheckoutData() {
    await Promise.all([
        loadCart(),
        loadAddresses()
    ]);
    renderCheckout();
}

// Load cart
async function loadCart() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            cartData = await response.json();
            if (!cartData.items || cartData.items.length === 0) {
                window.location.href = 'cart.html';
            }
        } else {
            alert('Failed to load cart');
            window.location.href = 'cart.html';
        }
    } catch (error) {
        console.error('Failed to load cart:', error);
        alert('Error loading cart');
    }
}

// Load user addresses
async function loadAddresses() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/users/addresses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const addresses = await response.json();
            if (addresses && addresses.length > 0) {
                selectedAddress = addresses.find(a => a.is_default) || addresses[0];
            }
        }
    } catch (error) {
        console.error('Failed to load addresses:', error);
    }
}

// Render checkout
function renderCheckout() {
    const container = document.getElementById('checkout-container');
    
    let subtotal = 0;
    cartData.items.forEach(item => {
        const price = item.has_discount ? 
            item.price * (1 - item.discount_percent / 100) : 
            item.price;
        subtotal += price * item.quantity;
    });

    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    let html = `
        <div class="row">
            <div class="col-lg-8">
                <!-- Shipping Address -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5><i class="fas fa-map-marker-alt"></i> Shipping Address</h5>
                    </div>
                    <div class="card-body">
                        ${selectedAddress ? `
                            <div class="selected-address">
                                <p><strong>${selectedAddress.recipient_name}</strong></p>
                                <p>${selectedAddress.phone_number}</p>
                                <p>${selectedAddress.address_line}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postal_code}</p>
                                ${selectedAddress.is_default ? '<span class="badge bg-primary">Default</span>' : ''}
                            </div>
                        ` : `
                            <p class="text-danger">No address found. Please add a shipping address.</p>
                            <a href="profile.html" class="btn btn-primary">Add Address</a>
                        `}
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5><i class="fas fa-credit-card"></i> Payment Method</h5>
                    </div>
                    <div class="card-body">
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="cod" value="cod" checked onchange="selectPaymentMethod('cod')">
                            <label class="form-check-label" for="cod">
                                <i class="fas fa-money-bill-wave"></i> Cash on Delivery
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="vnpay" value="vnpay" onchange="selectPaymentMethod('vnpay')">
                            <label class="form-check-label" for="vnpay">
                                <i class="fas fa-wallet"></i> VNPay
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="momo" value="momo" onchange="selectPaymentMethod('momo')">
                            <label class="form-check-label" for="momo">
                                <i class="fas fa-mobile-alt"></i> MoMo Wallet
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5><i class="fas fa-shopping-bag"></i> Order Items</h5>
                    </div>
                    <div class="card-body">
                        ${renderOrderItems(cartData.items)}
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <h5>Order Summary</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <strong>$${subtotal.toFixed(2)}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Shipping:</span>
                            <strong>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</strong>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between mb-4">
                            <h5>Total:</h5>
                            <h5 class="text-primary">$${total.toFixed(2)}</h5>
                        </div>
                        <button class="btn btn-primary w-100 btn-lg" onclick="placeOrder()" ${!selectedAddress ? 'disabled' : ''}>
                            <i class="fas fa-check-circle"></i> Place Order
                        </button>
                        <a href="cart.html" class="btn btn-outline-secondary w-100 mt-2">
                            <i class="fas fa-arrow-left"></i> Back to Cart
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Render order items
function renderOrderItems(items) {
    let html = '<div class="order-items">';
    
    items.forEach(item => {
        const price = item.has_discount ? 
            item.price * (1 - item.discount_percent / 100) : 
            item.price;
        
        html += `
            <div class="order-item d-flex align-items-center mb-3">
                <img src="${item.product_image || '../images/default-product.jpg'}" 
                     alt="${item.product_name}" 
                     style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px;">
                <div class="flex-grow-1">
                    <h6>${item.product_name}</h6>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
                <strong>$${(price * item.quantity).toFixed(2)}</strong>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Select payment method
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
}

// Place order
async function placeOrder() {
    if (!selectedAddress) {
        alert('Please select a shipping address');
        return;
    }

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const submitButton = event.target;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        // Create order
        const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                cart_id: cartData.id,
                shipping_address_id: selectedAddress.id,
                payment_method: selectedPaymentMethod
            })
        });

        if (!orderResponse.ok) {
            throw new Error('Failed to create order');
        }

        const orderData = await orderResponse.json();

        // Process payment
        if (selectedPaymentMethod === 'vnpay' || selectedPaymentMethod === 'momo') {
            const paymentResponse = await fetch(`${API_BASE_URL}/payments/${selectedPaymentMethod}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    order_id: orderData.id,
                    amount: orderData.total
                })
            });

            if (paymentResponse.ok) {
                const paymentData = await paymentResponse.json();
                // Redirect to payment gateway
                window.location.href = paymentData.payment_url;
            } else {
                throw new Error('Payment initiation failed');
            }
        } else {
            // COD - redirect to success page
            window.location.href = `order-success.html?order_id=${orderData.id}`;
        }
    } catch (error) {
        console.error('Place order error:', error);
        alert('Failed to place order. Please try again.');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    }
}

// Make functions globally available
window.selectPaymentMethod = selectPaymentMethod;
window.placeOrder = placeOrder;
