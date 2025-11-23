// Home.js - Load dynamic content for home page

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadDealsOfTheDay();
    loadBestSellers();
    loadRecentlyViewed();
});

// Load categories
async function loadCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        
        if (response.ok) {
            const categories = await response.json();
            renderCategories(categories, categoriesContainer);
        } else {
            categoriesContainer.innerHTML = '<p>Failed to load categories.</p>';
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
        categoriesContainer.innerHTML = '<p>Error loading categories.</p>';
    }
}

// Render categories
function renderCategories(categories, container) {
    if (!categories || categories.length === 0) {
        container.innerHTML = '<p>No categories available.</p>';
        return;
    }

    let html = '<div class="row">';
    categories.forEach(category => {
        html += `
            <div class="col-md-3 col-sm-6 mb-4">
                <a href="category.html?id=${category.id}" class="category-card">
                    <div class="card">
                        <img src="${category.image || '../images/default-category.jpg'}" class="card-img-top" alt="${category.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${category.name}</h5>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Load deals of the day
async function loadDealsOfTheDay() {
    const dealsContainer = document.getElementById('deals-container');
    if (!dealsContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products?hasDiscount=true&limit=8`);
        
        if (response.ok) {
            const products = await response.json();
            renderProductCarousel(products, dealsContainer, 'deals-swiper');
        } else {
            dealsContainer.innerHTML = '<p>No deals available.</p>';
        }
    } catch (error) {
        console.error('Failed to load deals:', error);
        dealsContainer.innerHTML = '<p>Error loading deals.</p>';
    }
}

// Load bestsellers
async function loadBestSellers() {
    const bestsellersContainer = document.getElementById('bestsellers-container');
    if (!bestsellersContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products?sortBy=popularity&limit=8`);
        
        if (response.ok) {
            const products = await response.json();
            renderProductCarousel(products, bestsellersContainer, 'bestsellers-swiper');
        } else {
            bestsellersContainer.innerHTML = '<p>No bestsellers available.</p>';
        }
    } catch (error) {
        console.error('Failed to load bestsellers:', error);
        bestsellersContainer.innerHTML = '<p>Error loading bestsellers.</p>';
    }
}

// Load recently viewed products
async function loadRecentlyViewed() {
    const recentContainer = document.getElementById('recently-viewed-container');
    if (!recentContainer) return;

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
        recentContainer.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/recently-viewed`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const products = await response.json();
            if (products && products.length > 0) {
                renderProductCarousel(products, recentContainer, 'recent-swiper');
            } else {
                recentContainer.style.display = 'none';
            }
        } else {
            recentContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Failed to load recently viewed:', error);
        recentContainer.style.display = 'none';
    }
}

// Render product carousel
function renderProductCarousel(products, container, swiperClass) {
    if (!products || products.length === 0) {
        container.innerHTML = '<p>No products available.</p>';
        return;
    }

    let html = `<div class="swiper ${swiperClass}">
        <div class="swiper-wrapper">`;
    
    products.forEach(product => {
        const hasDiscount = product.discount_percent > 0;
        const originalPrice = product.price;
        const discountedPrice = hasDiscount ? originalPrice * (1 - product.discount_percent / 100) : originalPrice;
        
        html += `
            <div class="swiper-slide">
                <div class="product-card">
                    ${hasDiscount ? `<span class="badge discount-badge">-${product.discount_percent}%</span>` : ''}
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image_thumbnail || '../images/default-product.jpg'}" alt="${product.name}">
                    </a>
                    <div class="product-info">
                        <h5><a href="product.html?id=${product.id}">${product.name}</a></h5>
                        <div class="product-price">
                            <span class="price">$${discountedPrice.toFixed(2)}</span>
                            ${hasDiscount ? `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `</div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
    </div>`;
    
    container.innerHTML = html;
    
    // Initialize Swiper
    new Swiper(`.${swiperClass}`, {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: `.${swiperClass} .swiper-button-next`,
            prevEl: `.${swiperClass} .swiper-button-prev`,
        },
        pagination: {
            el: `.${swiperClass} .swiper-pagination`,
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
    });
}

// Add to cart function
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
            // Update cart count in header
            if (window.headerAPI) {
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

// Make addToCart available globally
window.addToCart = addToCart;
