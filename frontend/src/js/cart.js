// Cart.js - Handle shopping cart functionality

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api';

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    const token = checkAuthentication();
    if (!token) {
        showLoginRequired();
    } else {
        loadCart();
    }
});

// Check if user is authenticated
function checkAuthentication() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Show login required message
function showLoginRequired() {
    const container = document.getElementById('cart-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-cart">
            <div class="empty-cart-message">
                <i class="fas fa-user-lock" style="font-size: 80px; color: #6c757d; margin-bottom: 20px;"></i>
                <h3>Vui lòng đăng nhập</h3>
                <p>Bạn cần đăng nhập để xem giỏ hàng của mình</p>
                <a href="login.html" class="login-link" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #007bff; color: white !important; text-decoration: none; border-radius: 5px; font-weight: 600;">
                    <i class="fas fa-sign-in-alt" style="color: white !important; margin-right: 8px;"></i> Đăng nhập ngay
                </a>
                <br>
                <a href="index.html" class="continue-shopping" style="display: inline-block; margin-top: 15px; color: #ffffff !important; text-decoration: none;">
                    <i class="fas fa-arrow-left" style="color: white !important; margin-right: 8px;"></i> Quay lại trang chủ
                </a>
            </div>
        </div>
    `;
}

// Load cart data
async function loadCart() {
    const container = document.getElementById('cart-container');
    const token = checkAuthentication();

    if (!container) return;
    
    if (!token) {
        showLoginRequired();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const result = await response.json();
            const cartData = result.data || result;
            renderCart(cartData, container);
        } else if (response.status === 401) {
            // Token invalid or expired
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            showLoginRequired();
        } else {
            const data = await response.json();
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <h3>Không thể tải giỏ hàng</h3>
                        <p>${data.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'}</p>
                        <a href="index.html" class="continue-shopping">Về trang chủ</a>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load cart:', error);
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Lỗi kết nối</h3>
                    <p>Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.</p>
                    <a href="index.html" class="continue-shopping">Về trang chủ</a>
                </div>
            </div>
        `;
    }
}

// Render cart with PHP-style product cards
function renderCart(cartData, container) {
    const items = Array.isArray(cartData) ? cartData : (cartData.items || []);
    
    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Giỏ hàng trống</h3>
                    <p>Bạn chưa có sản phẩm nào trong giỏ hàng!</p>
                    <a href="index.html" class="continue-shopping">Tiếp tục mua sắm</a>
                </div>
            </div>
        `;
        return;
    }

    let originalTotal = 0;
    let finalTotal = 0;
    let hasDiscount = false;

    // Build products HTML
    let productsHtml = '<div class="products-container">';
    items.forEach(item => {
        const itemPrice = parseFloat(item.price) || 0;
        const discountPercent = parseFloat(item.discount_percent) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const hasItemDiscount = item.has_discount && discountPercent > 0;
        
        const finalPrice = hasItemDiscount ? itemPrice * (1 - discountPercent / 100) : itemPrice;
        const itemOriginalTotal = itemPrice * quantity;
        const itemFinalTotal = finalPrice * quantity;
        
        originalTotal += itemOriginalTotal;
        finalTotal += itemFinalTotal;
        if (hasItemDiscount) hasDiscount = true;

        productsHtml += `
        <div class="product-card" data-item-id="${item.id}">
            <div class="product-image">
                <a href="product.html?id=${item.product_id || ''}"><img src="${item.product_image || '/images/default-product.jpg'}" alt="${item.product_name || 'Product'}"></a>
            </div>
            <div class="top-tags">
                ${item.brand_name ? `<div class="brand-tag">${item.brand_name}</div>` : ''}
                <div class="rating"><span class="star">★</span><span class="rating-count">(152)</span></div>
            </div>
            <div class="info">
                <h6><a href="product.html?id=${item.product_id || ''}">${item.product_name || 'Unknown Product'}</a></h6>
                ${hasItemDiscount ? `
                <h5 class="price discount">
                    <span class="current-price">${formatCurrency(finalPrice)}</span>
                    <span class="original-price">${formatCurrency(itemPrice)}</span>
                    <span class="discount-badge">-${discountPercent}%</span>
                </h5>` : `
                <h5 class="price">${formatCurrency(itemPrice)}</h5>`}
                <div class="sku-info">SKU: ${item.sku_name || 'N/A'}</div>
                <div class="add-more">
                    <span class="qt-minus" data-item-id="${item.id}">−</span>
                    <div class="input"><div>${quantity}</div></div>
                    <span class="qt-plus" data-item-id="${item.id}">+</span>
                </div>
                ${hasItemDiscount ? `
                <div class="item-total discount">
                    <span>Thành tiền:</span>
                    <span class="current-total">${formatCurrency(itemFinalTotal)}</span>
                    <span class="original-total">${formatCurrency(itemOriginalTotal)}</span>
                </div>` : `
                <div class="item-total">Thành tiền: ${formatCurrency(itemFinalTotal)}</div>`}
                <div class="action-buttons">
                    <a href="#" class="remove-btn" data-item-id="${item.id}"><i class="fas fa-times"></i></a>
                    <a href="product.html?id=${item.product_id || ''}" class="view-btn"><i class="fas fa-eye"></i></a>
                </div>
            </div>
        </div>`;
    });
    productsHtml += '</div>';

    // Build summary HTML
    const discountAmount = originalTotal - finalTotal;
    let summaryHtml = `
        <div class="cart-card">
            <h6 class="summary-title">Thông tin đơn hàng</h6>
            ${hasDiscount ? `
            <div class="card-item">
                <span class="item-label">Giá gốc:</span>
                <span class="original-price">${formatCurrency(originalTotal)}</span>
            </div>
            <div class="card-item discount-amount">
                <span class="item-label">Giảm giá:</span>
                <span class="discount-value">-${formatCurrency(discountAmount)}</span>
            </div>
            <div class="card-item">
                <span class="item-label">Tạm tính:</span>
                <strong class="discounted-price">${formatCurrency(finalTotal)}</strong>
            </div>` : `
            <div class="card-item">
                <span class="item-label">Tạm tính:</span>
                <strong>${formatCurrency(finalTotal)}</strong>
            </div>`}
            <div class="card-item">
                <span class="item-label">Phí vận chuyển:</span>
                <strong>Miễn phí</strong>
            </div>
            <div class="card-item total">
                <span class="item-label">Tổng cộng:</span>
                <strong class="${hasDiscount ? 'discounted-price' : ''}">${formatCurrency(finalTotal)}</strong>
            </div>
            <a href="checkout.html" class="checkout-btn">Thanh toán</a>
        </div>
    `;

    container.innerHTML = productsHtml + summaryHtml;
    attachEvents();
}

// Format currency helper
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Attach event listeners to cart buttons
function attachEvents() {
    // Quantity increase buttons
    document.querySelectorAll('.qt-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const card = this.closest('.product-card');
            const input = card.querySelector('.input div');
            const qty = parseInt(input.textContent) + 1;
            updateCart(itemId, qty);
        });
    });

    // Quantity decrease buttons
    document.querySelectorAll('.qt-minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const card = this.closest('.product-card');
            const input = card.querySelector('.input div');
            const qty = parseInt(input.textContent);
            if (qty > 1) {
                updateCart(itemId, qty - 1);
            }
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.dataset.itemId;
            removeCartItem(itemId);
        });
    });
}

// Update cart item quantity
async function updateCart(itemId, quantity) {
    const token = checkAuthentication();
    
    if (!token) {
        showLoginRequired();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });

        const data = await response.json();
        
        if (data.success) {
            loadCart();
            if (window.headerAPI) {
                window.headerAPI.loadCartCount();
            }
            showNotification(data.message || 'Giỏ hàng đã được cập nhật', 'success');
        } else {
            showNotification(data.message || 'Không thể cập nhật giỏ hàng', 'error');
        }
    } catch (error) {
        console.error('Update cart error:', error);
        showNotification('Đã xảy ra lỗi khi cập nhật giỏ hàng', 'error');
    }
}

// Remove item from cart
async function removeCartItem(itemId) {
    const token = checkAuthentication();
    
    if (!token) {
        showLoginRequired();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            loadCart();
            if (window.headerAPI) {
                window.headerAPI.loadCartCount();
            }
            showNotification(data.message || 'Sản phẩm đã được xóa khỏi giỏ hàng', 'success');
        } else {
            showNotification(data.message || 'Không thể xóa sản phẩm khỏi giỏ hàng', 'error');
        }
    } catch (error) {
        console.error('Remove cart item error:', error);
        showNotification('Đã xảy ra lỗi khi xóa sản phẩm', 'error');
    }
}

// Update cart count badge in header
function updateCartBadge(count) {
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Show notification messages
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
    setTimeout(() => notificationContainer.classList.add('show'), 10);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notificationContainer.classList.remove('show');
        setTimeout(() => document.body.removeChild(notificationContainer), 300);
    }, 3000);
}

// Make functions globally available
window.loadCart = loadCart;
window.updateCart = updateCart;
window.removeCartItem = removeCartItem;
