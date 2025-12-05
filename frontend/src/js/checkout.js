// Checkout.js - Handle checkout process

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

let cartData = null;
let allAddresses = [];
let selectedAddress = null;
let selectedPaymentMethod = 'cod';
let appliedVoucher = null;

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
            const result = await response.json();
            cartData = result.data || result;
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
        window.location.href = 'cart.html';
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
            const result = await response.json();
            allAddresses = result.data || result;
            if (allAddresses && allAddresses.length > 0) {
                selectedAddress = allAddresses.find(a => a.is_default) || allAddresses[0];
            }
        }
    } catch (error) {
        console.error('Failed to load addresses:', error);
    }
}

// Calculate total with voucher discount
function calculateTotal(subtotal, shipping) {
    let total = subtotal + shipping;
    if (appliedVoucher) {
        if (appliedVoucher.discount_type === 'percentage') {
            total -= total * (appliedVoucher.discount_value / 100);
        } else {
            total -= appliedVoucher.discount_value;
        }
        total = Math.max(0, total); // Ensure total doesn't go negative
    }
    return total;
}

// Apply voucher
async function applyVoucher() {
    const voucherCode = document.getElementById('voucherCode').value.trim();
    if (!voucherCode) {
        showVoucherMessage('Please enter a voucher code', 'danger');
        return;
    }

    if (!cartData || !cartData.items) {
        showVoucherMessage('Please wait for the page to load completely', 'warning');
        return;
    }

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const applyButton = event.target;
    const originalText = applyButton.innerHTML;
    applyButton.disabled = true;
    applyButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch(`${API_BASE_URL}/vouchers/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                code: voucherCode,
                cart_total: calculateTotal(
                    cartData.items.reduce((sum, item) => {
                        const price = item.has_discount ? 
                            item.price * (1 - item.discount_percent / 100) : 
                            item.price;
                        return sum + (price * item.quantity);
                    }, 0),
                    0
                )
            })
        });

        if (response.ok) {
            const result = await response.json();
            appliedVoucher = {
                code: voucherCode,
                discount: result.discount,
                discount_type: result.discount_type,
                discount_value: result.discount_value
            };
            showVoucherMessage(`Voucher applied! You saved $${result.discount.toFixed(2)}`, 'success');
            renderCheckout(); // Re-render to show applied voucher
        } else {
            const error = await response.json();
            showVoucherMessage(error.message || 'Invalid voucher code', 'danger');
            appliedVoucher = null;
        }
    } catch (error) {
        console.error('Voucher validation error:', error);
        showVoucherMessage('Failed to validate voucher. Please try again.', 'danger');
        appliedVoucher = null;
    } finally {
        applyButton.disabled = false;
        applyButton.innerHTML = originalText;
    }
}

// Remove voucher
function removeVoucher() {
    appliedVoucher = null;
    document.getElementById('voucherCode').value = '';
    showVoucherMessage('', ''); // Hide message
    renderCheckout(); // Re-render to update total
}

// Show voucher message
function showVoucherMessage(message, type) {
    const messageDiv = document.getElementById('voucherMessage');
    if (message) {
        messageDiv.style.display = 'block';
        messageDiv.className = `alert alert-${type} mt-2`;
        messageDiv.innerHTML = message;
    } else {
        messageDiv.style.display = 'none';
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
                        ${allAddresses && allAddresses.length > 0 ? `
                            <div class="address-selection">
                                ${allAddresses.map(address => `
                                    <div class="address-option ${selectedAddress && selectedAddress.id === address.id ? 'selected' : ''}">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="selectedAddress" 
                                                   id="address-${address.id}" value="${address.id}" 
                                                   ${selectedAddress && selectedAddress.id === address.id ? 'checked' : ''}>
                                            <label class="form-check-label" for="address-${address.id}">
                                                <div class="address-details">
                                                    <p><strong>${address.recipient_name}</strong></p>
                                                    <p>${address.phone}</p>
                                                    <p>${address.street_address}, ${address.city}, ${address.state} ${address.postal_code}</p>
                                                    ${address.is_default ? '<span class="badge bg-primary">Default</span>' : ''}
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="address-actions mt-3">
                                <a href="profile.html" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-plus"></i> Add New Address
                                </a>
                                <button class="btn btn-outline-secondary btn-sm" onclick="editSelectedAddress()">
                                    <i class="fas fa-edit"></i> Edit Selected Address
                                </button>
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
                        
                        <!-- Voucher Section -->
                        <div class="voucher-section mb-3">
                            <div class="input-group">
                                <input type="text" id="voucherCode" class="form-control" placeholder="Enter voucher code" maxlength="20">
                                <button class="btn btn-outline-primary" type="button" onclick="applyVoucher()">
                                    <i class="fas fa-tag"></i> Apply
                                </button>
                            </div>
                            <div id="voucherMessage" class="mt-2" style="display: none;"></div>
                            ${appliedVoucher ? `
                                <div class="applied-voucher mt-2 p-2 bg-light rounded">
                                    <small class="text-success">
                                        <i class="fas fa-check-circle"></i> 
                                        Voucher "${appliedVoucher.code}" applied (-$${appliedVoucher.discount.toFixed(2)})
                                    </small>
                                    <button class="btn btn-sm btn-link text-danger p-0 ms-2" onclick="removeVoucher()">
                                        <small>Remove</small>
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                        
                        <hr>
                        <div class="d-flex justify-content-between mb-4">
                            <h5>Total:</h5>
                            <h5 class="text-primary">$${calculateTotal(subtotal, shipping).toFixed(2)}</h5>
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
    attachAddressEvents();
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
                shipping_address: selectedAddress.id,
                payment_method: selectedPaymentMethod,
                voucher_code: appliedVoucher ? appliedVoucher.code : null
            })
        });

        if (!orderResponse.ok) {
            throw new Error('Failed to create order');
        }

        const orderData = await orderResponse.json();
        console.log('Order response:', orderData);
        console.log('Order response structure:', JSON.stringify(orderData, null, 2));
        console.log('Order data exists:', !!orderData.data);
        console.log('Order object exists:', !!orderData.data?.order);
        console.log('Order ID exists:', !!orderData.data?.order?.id);
        console.log('Order ID value:', orderData.data?.order?.id);
        console.log('Order ID path:', orderData.data?.order?.id);

        // Validate that we have the order ID
        if (!orderData.success || !orderData.data?.order?.id) {
            console.error('Invalid order response:', orderData);
            throw new Error('Invalid order response - missing order ID');
        }

        const orderId = orderData.data.order.id;

        // Calculate the final amount with voucher discount applied
        let subtotal = 0;
        cartData.items.forEach(item => {
            const price = item.has_discount ? 
                item.price * (1 - item.discount_percent / 100) : 
                item.price;
            subtotal += price * item.quantity;
        });
        const shipping = 0;
        const finalAmount = calculateTotal(subtotal, shipping);

        // Process payment
        if (selectedPaymentMethod === 'vnpay' || selectedPaymentMethod === 'momo') {
            const paymentResponse = await fetch(`http://localhost:3005/api/payments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    order_id: orderId,
                    amount: finalAmount,
                    payment_method: selectedPaymentMethod === 'vnpay' ? 'VNPay' : 'MoMo'
                })
            });

            if (paymentResponse.ok) {
                const paymentData = await paymentResponse.json();
                console.log('Payment response:', paymentData); // Debug log
                // Redirect to payment gateway
                if (paymentData.success && paymentData.data?.payment_url) {
                    window.location.href = paymentData.data.payment_url;
                } else {
                    console.error('Invalid payment response:', paymentData);
                    throw new Error('Invalid payment response - missing payment URL');
                }
            } else {
                throw new Error('Payment initiation failed');
            }
        } else {
            // COD - redirect to success page
            window.location.href = `order-success.html?order_id=${orderId}`;
        }
    } catch (error) {
        console.error('Place order error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        alert('Failed to place order. Please try again. Error: ' + error.message);
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    }
}

// Address selection handler
function selectAddress(addressId) {
    selectedAddress = allAddresses.find(addr => addr.id == addressId);
    renderCheckout(); // Re-render to update selection
}

// Edit selected address
function editSelectedAddress() {
    if (selectedAddress) {
        // Redirect to profile page with address ID for editing
        window.location.href = `profile.html?edit_address=${selectedAddress.id}`;
    } else {
        alert('Please select an address first');
    }
}

// Attach address selection events
function attachAddressEvents() {
    document.querySelectorAll('input[name="selectedAddress"]').forEach(radio => {
        radio.addEventListener('change', function() {
            selectAddress(this.value);
        });
    });
}

// Make functions globally available
window.selectPaymentMethod = selectPaymentMethod;
window.placeOrder = placeOrder;
window.selectAddress = selectAddress;
window.editSelectedAddress = editSelectedAddress;
window.applyVoucher = applyVoucher;
window.removeVoucher = removeVoucher;
