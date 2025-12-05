// Product.js - Handle product detail page

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

let currentProduct = null;
let selectedSKU = null;

// Initialize product page
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        loadProductDetails(productId);
        trackRecentlyViewed(productId);
    } else {
        document.getElementById('product-container').innerHTML = '<div class="alert alert-danger">Product not found.</div>';
    }
// Track recently viewed
async function trackRecentlyViewed(productId) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) return;
    try {
        await fetch(`${API_BASE_URL}/products/${productId}/view`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Failed to track view:', error);
    }
}
});

// Load product details
async function loadProductDetails(productId) {
    const container = document.getElementById('product-container');
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border"></div></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        
        if (response.ok) {
            const result = await response.json();
            currentProduct = result.data;
            renderProductDetails(currentProduct, container);
        } else {
            container.innerHTML = '<div class="alert alert-danger">Product not found.</div>';
        }
    } catch (error) {
        console.error('Failed to load product:', error);
        container.innerHTML = '<div class="alert alert-danger">Error loading product.</div>';
    }
}

// Render product details
function renderProductDetails(product, container) {
    // Use selected SKU price if available, otherwise fall back to product base price
    const currentSKU = selectedSKU || (product.skus && product.skus.length > 0 ? product.skus[0] : null);
    const basePrice = parseFloat(currentSKU ? currentSKU.price : (product.price || product.base_price || 0));
    const discountPercent = parseFloat(product.discount_percent || 0);
    const hasDiscount = discountPercent > 0;
    const price = hasDiscount ?
        basePrice * (1 - discountPercent / 100) :
        basePrice;

    // Get stock from selected SKU or product
    const stock = currentSKU ? currentSKU.stock : (product.stock || 0);

    let html = `
        <div class="row">
            <div class="col-md-6">
                <div class="product-image-gallery">
                    <img src="${product.image_thumbnail || '../images/default-product.jpg'}" 
                         alt="${product.name}" 
                         class="img-fluid main-product-image" 
                         id="main-image">
                </div>
            </div>
            <div class="col-md-6">
                <div class="product-details">
                    <h1>${product.name}</h1>
                    ${product.brand ? `<p class="text-muted">Brand: ${product.brand}</p>` : ''}
                    
                    <div class="product-price mb-3">
                        <h3 class="text-primary">$${price.toFixed(2)}</h3>
                        ${hasDiscount ? `
                            <span class="text-muted text-decoration-line-through">$${basePrice.toFixed(2)}</span>
                            <span class="badge bg-danger ms-2">-${discountPercent}%</span>
                        ` : ''}
                    </div>

                    <div class="product-description mb-4">
                        <h5>Description</h5>
                        <p>${product.description || 'No description available.'}</p>
                        ${product.description_2 ? `<p>${product.description_2}</p>` : ''}
                    </div>

                    ${product.skus && product.skus.length > 0 ? `
                        <div class="product-variants mb-4" id="sku-selector">
                            <h5>Select Variant</h5>
                            ${renderSKUOptions(product.skus)}
                        </div>
                    ` : ''}

                    <div class="quantity-selector mb-4">
                        <h5>Quantity</h5>
                        <div class="input-group" style="max-width: 150px;">
                            <button class="btn btn-outline-secondary" onclick="decreaseQuantity()">-</button>
                            <input type="number" id="quantity" class="form-control text-center" value="1" min="1">
                            <button class="btn btn-outline-secondary" onclick="increaseQuantity()">+</button>
                        </div>
                    </div>

                    <div class="product-actions mb-4">
                        <button class="btn btn-primary btn-lg me-2" onclick="addToCartWithQuantity()">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline-danger btn-lg" onclick="addToWishlist(${product.id})">
                            <i class="far fa-heart"></i> Wishlist
                        </button>
                    </div>

                    <div class="product-meta">
                        <p><strong>Category:</strong> ${getCategoryDisplay(product)}</p>
                        <p><strong>Availability:</strong> 
                            ${stock > 0 ? 
                                `<span class="text-success">In Stock (${stock} available)</span>` : 
                                '<span class="text-danger">Out of Stock</span>'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    
    // Set default SKU if available
    if (product.skus && product.skus.length > 0) {
        selectedSKU = product.skus[0];
    }
}

// Get category display name
function getCategoryDisplay(product) {
    if (product.category) {
        // If there's a parent category, show "Parent > Subcategory"
        if (product.category.parent && product.category.parent.name) {
            return `${product.category.parent.name} > ${product.category.name}`;
        }
        // Otherwise just show the category name
        return product.category.name;
    }
    return 'N/A';
}

// Render SKU options
function renderSKUOptions(skus) {
    let html = '<div class="sku-options">';
    
    skus.forEach((sku, index) => {
        html += `
            <button class="btn btn-outline-primary me-2 mb-2 ${index === 0 ? 'active' : ''}" 
                    onclick="selectSKU(${index})">
                ${sku.sku} ${sku.stock > 0 ? '' : '(Out of Stock)'}
            </button>
        `;
    });
    
    html += '</div>';
    return html;
}

// Select SKU
function selectSKU(index) {
    selectedSKU = currentProduct.skus[index];

    // Update active button
    const buttons = document.querySelectorAll('.sku-options button');
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Update price and stock display
    updatePriceAndStock();
}

// Update price and stock display based on selected SKU
function updatePriceAndStock() {
    const currentSKU = selectedSKU || (currentProduct.skus && currentProduct.skus.length > 0 ? currentProduct.skus[0] : null);
    if (!currentSKU) return;

    const basePrice = parseFloat(currentSKU.price);
    const discountPercent = parseFloat(currentProduct.discount_percent || 0);
    const hasDiscount = discountPercent > 0;
    const price = hasDiscount ?
        basePrice * (1 - discountPercent / 100) :
        basePrice;
    const stock = currentSKU.stock;

    // Update price display
    const priceElement = document.querySelector('.product-price h3');
    if (priceElement) {
        priceElement.textContent = `$${price.toFixed(2)}`;
    }

    // Update discount display if applicable
    const discountContainer = document.querySelector('.product-price');
    if (discountContainer && hasDiscount) {
        const existingDiscount = discountContainer.querySelector('.text-decoration-line-through');
        if (existingDiscount) {
            existingDiscount.textContent = `$${basePrice.toFixed(2)}`;
        }
    }

    // Update stock display
    const stockElement = document.querySelector('.product-meta p:last-child span');
    if (stockElement) {
        if (stock > 0) {
            stockElement.className = 'text-success';
            stockElement.textContent = `In Stock (${stock} available)`;
        } else {
            stockElement.className = 'text-danger';
            stockElement.textContent = 'Out of Stock';
        }
    }
}

// Quantity controls
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

// Add to cart with quantity
async function addToCartWithQuantity() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value);
    const skuId = selectedSKU ? selectedSKU.id : null;
    const productId = currentProduct.id;

    try {
        const response = await fetch(`${API_BASE_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: productId,
                sku_id: skuId,
                quantity: quantity
            })
        });

        if (response.ok) {
            alert('Product added to cart!');
            if (window.headerAPI) {
                window.headerAPI.loadCartCount();
            }
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        alert('Error adding to cart');
    }
}

// Add to wishlist
async function addToWishlist(productId) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
        alert('Please login to add items to wishlist');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId })
        });

        if (response.ok) {
            alert('Product added to wishlist!');
        } else {
            alert('Failed to add to wishlist');
        }
    } catch (error) {
        console.error('Add to wishlist error:', error);
        alert('Error adding to wishlist');
    }
}

// Removed trackRecentlyViewed function (no longer needed)

// Make functions globally available
window.selectSKU = selectSKU;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addToCartWithQuantity = addToCartWithQuantity;
window.addToWishlist = addToWishlist;
