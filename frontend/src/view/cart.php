<?php include 'header.php'; ?>
<link rel="stylesheet" href="css/cart-discount.css">

<div class="container">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
        <a href="index.php">Home</a>
        <span>/</span>
        <span class="current">Cart</span>
    </div>

    <!-- Main Content -->
    <section class="main-section" id="cart-container">
        <!-- Giỏ hàng sẽ được render ở đây bằng JavaScript -->
    </section>
</div>

<?php include 'footer.php'; ?>

<script src="../public/js/script.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("cart-container");

    // Load cart items
    function loadCart() {
        fetch('index.php?page=cart&action=get', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest' // Mark this as an AJAX request
            }
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    if (data.redirect) {
                        // If login required, show a message with a login link
                        container.innerHTML = `
                            <div class="empty-cart">
                                <div class="empty-cart-message">
                                    <i class="fas fa-exclamation-circle"></i>
                                    <p>${data.message}</p>
                                    <a href="${data.redirect}" class="login-link">Đăng nhập</a>
                                </div>
                            </div>`;
                    } else {
                        container.innerHTML = `
                            <div class="empty-cart">
                                <div class="empty-cart-message">
                                    <i class="fas fa-shopping-cart"></i>
                                    <p>${data.message}</p>
                                    <a href="index.php?page=category" class="continue-shopping">Tiếp tục mua sắm</a>
                                </div>
                            </div>`;
                    }
                    return;
                }

                // Check the structure of the data to handle both formats
                const items = Array.isArray(data.cart) ? data.cart : (data.cart.items || []);
                const total = data.total || (data.cart.total || '0₫');

                if (items.length === 0) {
                    container.innerHTML = '<p>Giỏ hàng của bạn đang trống.</p>';
                    return;
                }
                
                let productsHtml = '<div class="products-container">';
                items.forEach(item => {
                    productsHtml += `
                    <div class="product-card" data-item-id="${item.item_id}">
                        <div class="product-image">
                            <a href="index.php?page=product&id=${item.product_id}"><img src="${item.image_thumbnail || 'images/product-image.png'}" alt="${item.name}"></a>
                        </div>
                        <div class="top-tags">
                            ${item.brand_name ? `<div class="brand-tag">${item.brand_name}</div>` : ''}
                            <div class="rating"><span class="star">★</span><span class="rating-count">(152)</span></div>
                        </div>                        <div class="info">
                            <h6><a href="index.php?page=product&id=${item.product_id}">${item.name}</a></h6>
                            ${item.discount_percent > 0 ? `
                            <h5 class="price discount">
                                <span class="current-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.final_price)}</span>
                                <span class="original-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                                <span class="discount-badge">-${item.discount_percent}%</span>
                            </h5>` : `
                            <h5 class="price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</h5>`}
                            <div class="sku-info">SKU: ${item.sku}</div>
                            <div class="add-more">
                                <span class="qt-minus">−</span>
                                <div class="input"><div>${item.quantity}</div></div>
                                <span class="qt-plus">+</span>
                            </div>
                            ${item.discount_percent > 0 ? `
                            <div class="item-total discount">
                                <span>Thành tiền:</span>
                                <span class="current-total">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.final_price * item.quantity)}</span>
                                <span class="original-total">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</span>
                            </div>` : `
                            <div class="item-total">Thành tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</div>`}
                            <div class="action-buttons">
                                <a href="#" class="remove-btn" data-item-id="${item.item_id}"><i class="fas fa-times"></i></a>
                                <a href="index.php?page=product&id=${item.product_id}" class="view-btn"><i class="fas fa-eye"></i></a>
                            </div>
                        </div>
                    </div>`;
                });
                productsHtml += '</div>';
                
                const originalTotal = data.original_total || total;
                const finalTotal = data.total || total;
                const hasDiscount = data.has_discount || false;
                
                // Format totals if they're not already formatted
                const formattedOriginalTotal = typeof originalTotal === 'string' ? originalTotal : 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalTotal);
                const formattedFinalTotal = typeof finalTotal === 'string' ? finalTotal : 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal);
                
                let summaryHtml = `
                    <div class="cart-card">
                        <h6 class="summary-title">Thông tin đơn hàng</h6>
                        ${hasDiscount ? `
                        <div class="card-item">
                            <span class="item-label">Giá gốc:</span>
                            <span class="original-price">${formattedOriginalTotal}</span>
                        </div>
                        <div class="card-item discount-amount">
                            <span class="item-label">Giảm giá:</span>
                            <span class="discount-value">-${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                parseFloat(originalTotal.toString().replace(/[^\d.]/g, '')) - parseFloat(finalTotal.toString().replace(/[^\d.]/g, ''))
                            )}</span>
                        </div>
                        <div class="card-item">
                            <span class="item-label">Tạm tính:</span>
                            <strong class="discounted-price">${formattedFinalTotal}</strong>
                        </div>` : `
                        <div class="card-item">
                            <span class="item-label">Tạm tính:</span>
                            <strong>${formattedFinalTotal}</strong>
                        </div>`}
                        <div class="card-item">
                            <span class="item-label">Phí vận chuyển:</span>
                            <strong>Miễn phí</strong>
                        </div>
                        <div class="card-item total">
                            <span class="item-label">Tổng cộng:</span>
                            <strong class="${hasDiscount ? 'discounted-price' : ''}">${formattedFinalTotal}</strong>
                        </div>
                        <a href="index.php?page=checkout" class="checkout-btn">Thanh toán</a>
                    </div>
                `;
                
                let html = productsHtml + summaryHtml;

                container.innerHTML = html;
                attachEvents(); // Gắn sự kiện sau khi render
            })
            .catch(error => {
                console.error("Lỗi khi tải giỏ hàng:", error);
            });
    }    // Gắn sự kiện tăng/giảm/xóa
    function attachEvents() {
        document.querySelectorAll('.qt-plus').forEach(btn => {
            btn.addEventListener('click', function () {
                const card = this.closest('.product-card');
                const itemId = card.dataset.itemId;
                let input = card.querySelector('.input div');
                let qty = parseInt(input.textContent) + 1;
                updateCart(itemId, qty);
            });
        });

        document.querySelectorAll('.qt-minus').forEach(btn => {
            btn.addEventListener('click', function () {
                const card = this.closest('.product-card');
                const itemId = card.dataset.itemId;
                let input = card.querySelector('.input div');
                let qty = parseInt(input.textContent);
                if (qty > 1) updateCart(itemId, qty - 1);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const itemId = this.dataset.itemId;
                removeCartItem(itemId);
            });
        });
    }    // Gọi API update
    function updateCart(itemId, quantity) {
        const formData = new FormData();
        formData.append('action', 'update');
        formData.append('item_id', itemId);
        formData.append('quantity', quantity);
        
        fetch('index.php?page=cart', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest' // Mark as AJAX request
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadCart();
                // Cập nhật số lượng sản phẩm trên biểu tượng giỏ hàng
                if (data.cartCount !== undefined) {
                    updateCartBadge(data.cartCount);
                }
                // Show success message
                showNotification(data.message || 'Giỏ hàng đã được cập nhật', 'success');
            } else {
                showNotification(data.message || 'Không thể cập nhật giỏ hàng', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Đã xảy ra lỗi khi cập nhật giỏ hàng', 'error');
        });
    }

    // Gọi API remove
    function removeCartItem(itemId) {
        const formData = new FormData();
        formData.append('action', 'remove');
        formData.append('item_id', itemId);
        
        fetch('index.php?page=cart', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest' // Mark as AJAX request
            }
        })        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadCart();
                // Update cart count in header
                if (data.cartCount !== undefined) {
                    updateCartBadge(data.cartCount);
                }
                // Show success message
                showNotification(data.message || 'Sản phẩm đã được xóa khỏi giỏ hàng', 'success');
            } else {
                showNotification(data.message || 'Không thể xóa sản phẩm khỏi giỏ hàng', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Đã xảy ra lỗi khi xóa sản phẩm', 'error');
        });
    }
    
    // Function to update the cart count badge in header
    function updateCartBadge(count) {
        const cartBadge = document.querySelector('.cart-count');
        if (cartBadge) {
            cartBadge.textContent = count;
            if (count > 0) {
                cartBadge.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
            }
        }
    }
    
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

    loadCart();
});
</script>


</body>
</html>
