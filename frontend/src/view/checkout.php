<?php
$page = 'checkout';
include 'header.php';
?>
<link rel="stylesheet" href="css/checkout-discount.css">

<div class="checkout-page"> 
    <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="index.php">Home</a>
            <span>/</span>
            <span class="current">Checkout</span>
        </div>

        <!-- Checkout Main Section -->
        <div class="checkout-section">
            <h6 class="checkout-title">checkout</h6>
            
            <!-- Alert Messages -->
            <div class="alert-container">
                <div class="alert">
                    <span class="icon"><i class="fas fa-info-circle"></i></span>
                    <span class="alert-text">Returning customer? Click here to log in</span>
                </div>
                <div class="alert">
                    <span class="icon"><i class="fas fa-tag"></i></span>
                    <span class="alert-text">Have a coupon? Click here to enter your code</span>
                </div>
            </div>

            <div class="checkout-content">
                <!-- Shipping Address Selection -->
                <div class="billing-form">
                    <h6>Địa chỉ giao hàng</h6>
                    <div class="saved-addresses" id="address-list">
                        <div class="loading-addresses">Đang tải địa chỉ...</div>
                    </div>
                    
                    <button type="button" id="add-new-address" class="btn-add-address">
                        <i class="fas fa-plus"></i> Thêm địa chỉ mới
                    </button>
                    
                    <!-- Address Form - Hidden by default, shown when adding new address -->
                    <form id="address-form" style="display: none;" action="index.php?page=address" method="post">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="recipient_name">Họ và tên người nhận *</label>
                                <input type="text" id="recipient_name" name="recipient_name" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="phone">Số điện thoại *</label>
                            <input type="text" id="phone" name="phone" required>
                        </div>

                        <div class="form-group">
                            <label for="street_address">Địa chỉ cụ thể *</label>
                            <input type="text" id="street_address" name="street_address" placeholder="Số nhà, đường, phường/xã" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">Tỉnh/Thành phố *</label>
                                <input type="text" id="city" name="city" required>
                            </div>
                            <div class="form-group">
                                <label for="state">Quận/Huyện</label>
                                <input type="text" id="state" name="state">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="postal_code">Mã bưu điện</label>
                                <input type="text" id="postal_code" name="postal_code">
                            </div>
                            <div class="form-group">
                                <label for="country">Quốc gia</label>
                                <div class="select-wrapper">                                    <select id="country" name="country">
                                        <option value="Vietnam" selected>Việt Nam</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Thailand">Thailand</option>
                                        <option value="Malaysia">Malaysia</option>
                                    </select>
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group checkbox-field">
                            <input type="checkbox" id="is_default" name="is_default">
                            <label for="is_default">Đặt làm địa chỉ mặc định</label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn-save-address">Lưu địa chỉ</button>
                            <button type="button" class="btn-cancel-address">Hủy</button>
                        </div>                    </form>
                    
                    <!-- Payment Methods -->
                    <!-- Payment Methods -->
                    <h6 class="payment-title">Phương thức thanh toán</h6>
                    <div class="payment-methods">
                        <label class="payment-option">
                            <input type="radio" id="payment-cod" name="payment_method" value="cod" checked>
                            <span class="custom-radio"></span>
                            <div class="payment-info">
                                <span class="payment-name">Thanh toán khi nhận hàng (COD)</span>
                                <p class="payment-description">Thanh toán bằng tiền mặt khi nhận hàng tại nhà</p>
                            </div>
                        </label>

                        <label class="payment-option">
                            <input type="radio" id="payment-vnpay" name="payment_method" value="vnpay">
                            <span class="custom-radio"></span>
                            <div class="payment-info">
                                <img src="images/vnpay.png" alt="VNPay" class="payment-icon">
                                <span class="payment-name">Thanh toán qua VNPay</span>
                                <p class="payment-description">Thanh toán trực tuyến qua cổng VNPay</p>
                            </div>
                        </label>

                        <label class="payment-option">
                            <input type="radio" id="payment-momo" name="payment_method" value="momo">
                            <span class="custom-radio"></span>
                            <div class="payment-info">
                                <img src="images/momo.png" alt="Momo" class="payment-icon">
                                <span class="payment-name">Thanh toán qua MoMo</span>
                                <p class="payment-description">Thanh toán trực tuyến qua ví MoMo</p>
                            </div>
                        </label>
                    </div>
              
                </div>
                
                <!-- Order Summary -->
                <div class="order-summary">
                    <h6>Đơn hàng của bạn</h6>
                    
                    <div class="summary-header">
                        <span class="product-column">Sản phẩm</span>
                        <span class="subtotal-column">Tạm tính</span>
                    </div>
                    
                    <div class="cart-items" id="checkout-items">
                        <!-- Cart items will be loaded here via JavaScript -->
                    </div>
                    
                    <div class="order-total">
                        <div class="total-row">
                            <span>Tổng sản phẩm:</span>
                            <span class="subtotal" id="cart-subtotal">0₫</span>
                        </div>
                        <div class="total-row">
                            <span>Phí vận chuyển:</span>
                            <span id="shipping-fee">Miễn phí</span>
                        </div>
                        <div class="total-row final-total">
                            <span>Tổng thanh toán:</span>
                            <span class="total" id="cart-total">0₫</span>
                        </div>
                    </div>
                    
                    <form id="checkout-form" method="post">
                        <input type="hidden" name="address_id" id="selected-address-id">
                        <div class="payment-method-summary">
                            <div class="payment-method-selected">
                                <span>Phương thức thanh toán:</span>
                                <strong id="selected-payment-display">Thanh toán khi nhận hàng (COD)</strong>
                            </div>
                        </div>
                        <button type="submit" id="place-order-btn" class="btn-place-order">Đặt hàng</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const addressList = document.getElementById('address-list');
    const addNewAddressBtn = document.getElementById('add-new-address');
    const addressForm = document.getElementById('address-form');
    const checkoutForm = document.getElementById('checkout-form');
    const selectedAddressIdInput = document.getElementById('selected-address-id');
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Load checkout data (cart items and addresses)
    function loadCheckoutData() {
        fetch('index.php?page=checkout', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Check the structure of the cart data
                const items = Array.isArray(data.cart) ? data.cart : (data.cart.items || []);
                
                // Handle the new total format with discount information
                const totalData = {
                    total: data.total || (data.cart.total || '0₫'),
                    original_total: data.original_total || data.total || (data.cart.total || '0₫'),
                    has_discount: data.has_discount || false
                };
                
                // Render cart items
                renderCartItems(items);
                // Update totals
                updateCartTotals(totalData);
                // Render addresses
                renderAddresses(data.addresses, data.defaultAddress);
            } else {
                // Handle error (empty cart or not logged in)
                if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    showNotification(data.message || 'Không thể tải thông tin thanh toán', 'error');
                    checkoutItemsContainer.innerHTML = '<p class="empty-cart-message">Giỏ hàng của bạn đang trống</p>';
                }
            }
        })
        .catch(err => {
            console.error('Error loading checkout data:', err);
            showNotification('Đã xảy ra lỗi khi tải thông tin thanh toán', 'error');
        });
    }
    
    // Render cart items
    function renderCartItems(items) {
        if (!items || items.length === 0) {
            checkoutItemsContainer.innerHTML = '<p class="empty-cart-message">Giỏ hàng của bạn đang trống</p>';
            return;
        }
        
        let html = '';
        items.forEach(item => {
            const hasDiscount = item.has_discount === 1;
            html += `
                <div class="cart-item ${hasDiscount ? 'has-discount' : ''}">
                    <div class="item-info">
                        <img src="${item.image_thumbnail || 'images/product-image.png'}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <h4 class="item-name">${item.name}</h4>
                            <div class="item-meta">SKU: ${item.sku}</div>
                            ${item.discount_percent > 0 ? `
                            <div class="item-price discount">
                                <span class="discounted-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.final_price)}</span>
                                <span class="original-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                                <span class="discount-badge">-${item.discount_percent}%</span>
                            </div>` : `
                            <div class="item-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</div>`}
                        </div>
                    </div>
                    <div class="item-quantity">x${item.quantity}</div>
                    ${item.discount_percent > 0 ? `
                    <div class="item-subtotal discount">
                        <span class="discounted-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.final_price * item.quantity)}</span>
                        <span class="original-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</span>
                    </div>` : `
                    <div class="item-subtotal">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</div>`}
                </div>
            `;
        });
        
        checkoutItemsContainer.innerHTML = html;
    }
    
    // Update cart totals
    function updateCartTotals(total) {
        // Check if it's a string (formatted already) or an object with discount info
        if (typeof total === 'object') {
            // Handle the new format with discount information
            const hasDiscount = total.has_discount;
            
            if (hasDiscount) {
                // Create elements for displaying original and discounted prices
                const originalTotalFormatted = typeof total.original_total === 'string' ? total.original_total : 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total.original_total);
                
                const discountedTotalFormatted = typeof total.total === 'string' ? total.total : 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total.total);
                
                // Update the subtotal section to show both prices
                cartSubtotalElement.innerHTML = `
                    <span class="discounted-price">${discountedTotalFormatted}</span>
                    <span class="original-price">${originalTotalFormatted}</span>
                `;
                
                // Update the final total
                cartTotalElement.innerHTML = `
                    <span class="discounted-price">${discountedTotalFormatted}</span>
                `;
                
                // Add discount row if it doesn't exist
                let discountRow = document.querySelector('.discount-row');
                if (!discountRow) {
                    discountRow = document.createElement('div');
                    discountRow.className = 'total-row discount-row';
                    
                    // Calculate the discount amount
                    const originalTotal = parseFloat(total.original_total.toString().replace(/[^\d]/g, ''));
                    const finalTotal = parseFloat(total.total.toString().replace(/[^\d]/g, ''));
                    const discountAmount = originalTotal - finalTotal;
                    
                    discountRow.innerHTML = `
                        <span>Giảm giá:</span>
                        <span class="discount-amount">-${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}</span>
                    `;
                    
                    // Insert it before the final total row
                    const finalTotalRow = document.querySelector('.final-total');
                    finalTotalRow.parentNode.insertBefore(discountRow, finalTotalRow);
                }
            } else {
                // No discount, just use the total
                const formattedTotal = typeof total.total === 'string' ? total.total : 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total.total);
                
                cartSubtotalElement.textContent = formattedTotal;
                cartTotalElement.textContent = formattedTotal;
                
                // Remove discount row if it exists
                const discountRow = document.querySelector('.discount-row');
                if (discountRow) {
                    discountRow.remove();
                }
            }
        } else {
            // Handle the old format (just a string or number)
            const formattedTotal = typeof total === 'string' ? total : 
                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
            
            cartSubtotalElement.textContent = formattedTotal;
            cartTotalElement.textContent = formattedTotal;
        }
    }
    
    // Render shipping addresses
    function renderAddresses(addresses, defaultAddress) {
        if (!addresses || addresses.length === 0) {
            addressList.innerHTML = '<p class="no-addresses">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>';
            addNewAddressBtn.click(); // Show address form if none exists
            return;
        }

        let html = '';
        addresses.forEach(address => {
            const isDefault = address.is_default == 1;
            const isSelected = defaultAddress ? defaultAddress.id == address.id : isDefault;

            html += `
                <label class="address-card ${isDefault ? 'default' : ''} ${isSelected ? 'selected' : ''}">
                    <input type="radio" name="address_id" value="${address.id}" ${isSelected ? 'checked' : ''} class="address-radio">
                    <div class="address-content">
                        <div class="recipient-info">
                            <strong>${address.recipient_name}</strong>
                            <span>${address.phone}</span>
                        </div>
                        <div class="address-details">
                            ${address.street_address},
                            ${address.city}${address.state ? ', ' + address.state : ''}
                            ${address.postal_code ? ', ' + address.postal_code : ''}
                            ${address.country ? ', ' + address.country : ''}
                        </div>
                        ${isDefault ? '<div class="default-badge">Mặc định</div>' : ''}
                    </div>
                </label>
            `;
        });

        addressList.innerHTML = html;
        
        // Initialize the selected address ID from the selected radio button
        const selectedRadio = addressList.querySelector('input[type="radio"]:checked');
        if (selectedRadio) {
            selectedAddressIdInput.value = selectedRadio.value;
        } else if (addresses.length > 0) {
            // If somehow no address is selected, select the first one
            selectedAddressIdInput.value = addresses[0].id;
        }
        
        // Add event listeners to radio buttons
        document.querySelectorAll('.address-radio').forEach(radio => {
            radio.addEventListener('change', function() {
                // Remove selected class from all cards
                document.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
                // Add selected class to parent card
                this.closest('.address-card').classList.add('selected');
                // Set the selected address ID
                selectedAddressIdInput.value = this.value;
            });
        });
    }
    
    // Event listener for "Add new address" button
    if (addNewAddressBtn) {
        addNewAddressBtn.addEventListener('click', function() {
            addressForm.style.display = 'block';
            this.style.display = 'none';
        });
    }
    
    // Event listener for "Cancel" button in address form
    const cancelAddressBtn = document.querySelector('.btn-cancel-address');
    if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', function() {
            addressForm.style.display = 'none';
            addNewAddressBtn.style.display = 'block';
            addressForm.reset();
        });
    }
    
    // Event listener for address form submission
    addressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('action', 'add');
        
        fetch('index.php?page=address', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showNotification('Đã thêm địa chỉ mới thành công', 'success');
                addressForm.style.display = 'none';
                addNewAddressBtn.style.display = 'block';
                addressForm.reset();
                // Reload addresses
                loadCheckoutData();
            } else {
                showNotification(data.message || 'Không thể thêm địa chỉ mới', 'error');
            }
        })
        .catch(err => {
            console.error('Error adding address:', err);
            showNotification('Đã xảy ra lỗi khi thêm địa chỉ', 'error');
        });
    });
    
    // Event listener for checkout form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate address selection
        if (!selectedAddressIdInput.value) {
            showNotification('Vui lòng chọn địa chỉ giao hàng', 'error');
            return;
        }
        
        // Validate payment method selection
        const selectedPaymentMethod = document.querySelector('input[name="payment_method"]:checked');
        if (!selectedPaymentMethod) {
            showNotification('Vui lòng chọn phương thức thanh toán', 'error');
            return;
        }
        
        const formData = new FormData(this);
        formData.append('payment_method', selectedPaymentMethod.value);
        
        // Disable button during submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang xử lý...';
        
        fetch('index.php?page=checkout', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message || 'Đặt hàng thành công!', 'success');
                
                if (data.paymentRequired && data.paymentUrl) {
                    // Redirect to payment gateway
                    window.location.href = data.paymentUrl;
                } else if (data.redirect) {
                    // Redirect to thank you page
                    window.location.href = data.redirect;
                }
            } else {
                showNotification(data.message || 'Không thể hoàn tất đơn hàng', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        })
        .catch(err => {
            console.error('Error during checkout:', err);
            showNotification('Đã xảy ra lỗi khi xử lý đơn hàng', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    });
    
    // Function to show notifications
    function showNotification(message, type = 'success') {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = `notification ${type}`;
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        const messageText = document.createElement('span');
        messageText.textContent = message;
        
        notificationContainer.appendChild(icon);
        notificationContainer.appendChild(messageText);
        
        document.body.appendChild(notificationContainer);
        
        // Show with animation
        setTimeout(() => {
            notificationContainer.classList.add('show');
        }, 10);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notificationContainer.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notificationContainer);
            }, 300);
        }, 3000);
    }
    
    // Load checkout data on page load
    loadCheckoutData();
});
</script>

<?php include 'footer.php'; ?>
