// Category.js - Handle category page with filters and product listing

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

let currentPage = 1;
let currentFilters = {
    categoryId: null,
    subCategoryId: null,
    search: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'newest'
};
let currentView = 'grid'; // 'grid' or 'list'

// Initialize category page
document.addEventListener('DOMContentLoaded', () => {
    parseURLParameters();
    loadCategories();
    loadProducts();
    initializeFilters();
    initializeViewToggle();
});

// Parse URL parameters
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.categoryId = urlParams.get('categoryId') || urlParams.get('id');
    currentFilters.search = urlParams.get('search');
}

// Load categories for filter
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`);

        if (response.ok) {
            const result = await response.json();
            const categories = result.data || [];
            renderCategoryFilter(categories);
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

// Render category filter
function renderCategoryFilter(categories) {
    const filterContainer = document.getElementById('category-filter');
    if (!filterContainer) return;

    let html = '';
    categories.forEach(category => {
        html += `
            <li>
                <a href="?categoryId=${category.id}" class="${currentFilters.categoryId == category.id ? 'active' : ''}">
                    ${category.name}
                </a>
            </li>
        `;
    });
    filterContainer.innerHTML = `<ul class="list-unstyled">${html}</ul>`;

    // Update breadcrumb
    if (currentFilters.categoryId) {
        const currentCategory = categories.find(cat => cat.id == currentFilters.categoryId);
        if (currentCategory) {
            document.getElementById('breadcrumb-category').textContent = currentCategory.name;
        }
    }
}

// Load products
async function loadProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border"></div></div>';

    try {
        let url = `${API_BASE_URL}/products?page=${currentPage}`;

        if (currentFilters.categoryId) {
            url += `&categoryId=${currentFilters.categoryId}`;
        }
        if (currentFilters.subCategoryId) {
            url += `&subCategoryId=${currentFilters.subCategoryId}`;
        }
        if (currentFilters.search) {
            url += `&search=${encodeURIComponent(currentFilters.search)}`;
        }
        if (currentFilters.minPrice) {
            url += `&minPrice=${currentFilters.minPrice}`;
        }
        if (currentFilters.maxPrice) {
            url += `&maxPrice=${currentFilters.maxPrice}`;
        }
        if (currentFilters.sortBy) {
            url += `&sortBy=${currentFilters.sortBy}`;
        }

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            renderProducts(data.data?.products || [], container);
            renderPagination(data.data?.pagination);
            updateResultsCount(data.data?.pagination);
        } else {
            container.innerHTML = '<div class="alert alert-warning">No products found.</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="alert alert-danger">Failed to load products. Please try again.</div>';
        console.error('Failed to load products:', error);
    }
}

// Render products
function renderProducts(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No products found matching your criteria.</div>';
        return;
    }

    let html = '';
    const viewClass = currentView === 'grid' ? 'products-grid' : 'products-list';

    products.forEach(product => {
        // Get price from product or first available SKU
        let price = 0;
        if (product.price) {
            price = parseFloat(product.price);
        } else if (product.skus && product.skus.length > 0) {
            price = parseFloat(product.skus[0].price);
        }

        // For now, disable discount logic since it's not in the API response
        const hasDiscount = false; // product.discount_percent > 0;
        const originalPrice = price;

        if (currentView === 'grid') {
            html += `
                <div class="product-card">
                    ${hasDiscount ? `<span class="discount-badge">-${product.discount_percent}%</span>` : ''}
                    <div class="product-image-container">
                        <a href="product.html?id=${product.id}">
                            <img src="${product.image_thumbnail || '../images/default-product.jpg'}"
                                 alt="${product.name}"
                                 class="product-image">
                        </a>
                    </div>
                    <div class="product-info">
                        <h5><a href="product.html?id=${product.id}">${product.name}</a></h5>
                        <p class="product-category">${product.category?.name || ''}</p>
                        <div class="product-price">
                            <span class="price">${price > 0 ? '$' + price.toFixed(2) : 'Price not available'}</span>
                            ${hasDiscount ? `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="product-card-list">
                    <div class="product-image-container-list">
                        <a href="product.html?id=${product.id}">
                            <img src="${product.image_thumbnail || '../images/default-product.jpg'}"
                                 alt="${product.name}"
                                 class="product-image-list">
                        </a>
                    </div>
                    <div class="product-info-list">
                        <div>
                            <h5><a href="product.html?id=${product.id}">${product.name}</a></h5>
                            <p class="product-description">${product.description ? product.description.substring(0, 150) + '...' : ''}</p>
                        </div>
                        <div class="product-meta">
                            <span class="product-category-list">${product.category?.name || ''}</span>
                            <div class="product-price">
                                <span class="price">${price > 0 ? '$' + price.toFixed(2) : 'Price not available'}</span>
                                ${hasDiscount ? `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <button class="add-to-cart-btn-list" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    container.className = viewClass;
    container.innerHTML = html;
}

// Render pagination
function renderPagination(pagination) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer || !pagination) return;

    const { page: currentPage, totalPages } = pagination;
    let html = '<nav><ul class="pagination justify-content-center">';

    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">Next</a>
        </li>
    `;

    html += '</ul></nav>';
    paginationContainer.innerHTML = html;
}

// Initialize filters
function initializeFilters() {
    // Sort by
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sortBy = e.target.value;
            currentPage = 1;
            loadProducts();
        });
    }

    // Price filter
    const applyPriceBtn = document.getElementById('apply-price-filter');
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
            currentFilters.minPrice = document.getElementById('min-price').value;
            currentFilters.maxPrice = document.getElementById('max-price').value;
            currentPage = 1;
            loadProducts();
        });
    }
}

// Go to page
function goToPage(page) {
    event.preventDefault();
    currentPage = page;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add to cart
async function addToCart(productId) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch product details to get the first SKU
        const productResponse = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!productResponse.ok) {
            alert('Failed to fetch product details');
            return;
        }
        const productData = await productResponse.json();
        const product = productData.data;
        if (!product.skus || product.skus.length === 0) {
            alert('No SKUs available for this product');
            return;
        }
        const skuId = product.skus[0].id; // Use the first SKU

        const response = await fetch(`${API_BASE_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: productId,
                sku_id: skuId,
                quantity: 1
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

// Initialize view toggle
function initializeViewToggle() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');

    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            currentView = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            loadProducts();
        });

        listViewBtn.addEventListener('click', () => {
            currentView = 'list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            loadProducts();
        });

        // Set initial active state
        if (currentView === 'grid') {
            gridViewBtn.classList.add('active');
        } else {
            listViewBtn.classList.add('active');
        }
    }
}

// Update results count
function updateResultsCount(pagination) {
    const resultsText = document.getElementById('results-text');
    if (!resultsText || !pagination) return;

    const { total, page, limit, totalPages } = pagination;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    if (total === 0) {
        resultsText.textContent = 'No products found';
    } else {
        resultsText.textContent = `Showing ${start}-${end} of ${total} products`;
    }
}

// Make functions globally available
window.goToPage = goToPage;
window.addToCart = addToCart;
