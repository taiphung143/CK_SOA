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

// Initialize category page
document.addEventListener('DOMContentLoaded', () => {
    parseURLParameters();
    loadCategories();
    loadProducts();
    initializeFilters();
});

// Parse URL parameters
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.categoryId = urlParams.get('id');
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
    const filterContainer = document.querySelector('.category-filter');
    if (!filterContainer) return;

    let html = '<h5>Categories</h5><ul class="list-unstyled">';
    categories.forEach(category => {
        html += `
            <li>
                <a href="?id=${category.id}" class="${currentFilters.categoryId == category.id ? 'active' : ''}">
                    ${category.name}
                </a>
            </li>
        `;
    });
    html += '</ul>';
    filterContainer.innerHTML = html;
}

// Load products
async function loadProducts() {
    const container = document.getElementById('category-container');
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
            renderProducts(data.products || data, container);
            renderPagination(data.pagination);
        } else {
            container.innerHTML = '<div class="alert alert-warning">No products found.</div>';
        }
    } catch (error) {
        console.error('Failed to load products:', error);
        container.innerHTML = '<div class="alert alert-danger">Error loading products.</div>';
    }
}

// Render products
function renderProducts(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No products found matching your criteria.</div>';
        return;
    }

    let html = '<div class="row">';
    
    products.forEach(product => {
        const hasDiscount = product.discount_percent > 0;
        const price = hasDiscount ? 
            product.price * (1 - product.discount_percent / 100) : 
            product.price;

        html += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="product-card">
                    ${hasDiscount ? `<span class="badge discount-badge">-${product.discount_percent}%</span>` : ''}
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image_thumbnail || '../images/default-product.jpg'}" 
                             alt="${product.name}" 
                             class="product-image">
                    </a>
                    <div class="product-info">
                        <h5><a href="product.html?id=${product.id}">${product.name}</a></h5>
                        <p class="text-muted small">${product.category_name || ''}</p>
                        <div class="product-price">
                            <span class="price">$${price.toFixed(2)}</span>
                            ${hasDiscount ? `<span class="original-price">$${product.price.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="btn btn-primary btn-sm w-100 mt-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Render pagination
function renderPagination(pagination) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer || !pagination) return;

    const { currentPage, totalPages } = pagination;
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

// Make functions globally available
window.goToPage = goToPage;
window.addToCart = addToCart;
