// Home.js - Load dynamic content for home page

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api'; // API Gateway URL

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadDealsOfTheDay();
    loadBestSellers();
    initializeAdvertisements();
});

// Load categories
async function loadCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        
        if (response.ok) {
            const result = await response.json();
            const categories = result.data || [];
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

    let html = '<div class="div-category">';
    categories.forEach(category => {
        html += `
            <a href="category.html?id=${category.id}" class="link-category">
                <img src="${category.image || '../images/default-category.jpg'}" alt="${category.name}">
                <p>${category.name}</p>
            </a>
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
        const response = await fetch(`${API_BASE_URL}/products?is_featured=true&limit=30`);
        
        if (response.ok) {
            const result = await response.json();
            const products = result.data?.products || [];
            console.log('Deals products:', products);
            console.log('Total deals:', products.length);
            renderDealsGrid(products, dealsContainer);
        } else {
            dealsContainer.innerHTML = '<p>No deals available.</p>';
        }
    } catch (error) {
        console.error('Failed to load deals:', error);
        dealsContainer.innerHTML = '<p>Error loading deals.</p>';
    }
}

// Render deals in grid format
function renderDealsGrid(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<p>No deals available.</p>';
        return;
    }

    let currentPage = 0;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const navContainer = document.getElementById('deals-navigation-container');

    function renderPage(page) {
        let html = '';
        
        const start = page * itemsPerPage;
        const end = Math.min(start + itemsPerPage, products.length);
        
        for (let i = start; i < end; i++) {
            const product = products[i];
            const skuPrice = product.skus && product.skus.length > 0 ? parseFloat(product.skus[0].price) : 0;
            const stock = product.skus && product.skus.length > 0 ? product.skus[0].stock : 0;
            const soldPercentage = Math.min(Math.random() * 100, 100); // Mock sold percentage
            
            html += `
                <div class="column">
                    <div class="div-deal-card">
                        <a href="product.html?id=${product.id}" class="link-png" style="background-image: url('${product.image_thumbnail || '/images/product-image.png'}')"></a>
                        <div class="div-top">
                            <small class="small">Installment</small>
                            <div class="symbol-wrapper">
                                <i class="fas fa-heart symbol-2"></i>
                            </div>
                        </div>
                        <div class="div-info">
                            <span class="span-label">HOT</span>
                            <a href="product.html?id=${product.id}" class="link-info">${product.name}</a>
                            <div class="rating">
                                <i class="fas fa-star symbol-3"></i>
                                <i class="fas fa-star symbol-4"></i>
                                <i class="fas fa-star symbol-5"></i>
                                <i class="fas fa-star symbol-6"></i>
                                <i class="far fa-star symbol-8"></i>
                                <span class="text-wrapper-10">(4.0)</span>
                            </div>
                            <div class="price-info">
                                <span class="text-wrapper-11">$${skuPrice.toFixed(2)}</span>
                            </div>
                            <div class="div-progress">
                                <div class="progressbar" style="width: ${soldPercentage}%"></div>
                            </div>
                            <span class="text-wrapper-13">Sold: ${Math.floor(soldPercentage)}/${stock}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        // Render navigation buttons in separate container
        if (navContainer) {
            navContainer.innerHTML = `
                <div class="deals-navigation">
                    <button class="deals-nav-btn deals-prev" ${page === 0 ? 'disabled' : ''} onclick="window.dealsNavigate(-1)">
                        <i class="fas fa-chevron-left"></i> Previous
                    </button>
                    <span class="deals-page-info">Page ${page + 1} of ${totalPages}</span>
                    <button class="deals-nav-btn deals-next" ${page === totalPages - 1 ? 'disabled' : ''} onclick="window.dealsNavigate(1)">
                        Next <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
        }
    }

    // Navigation function
    window.dealsNavigate = function(direction) {
        currentPage = Math.max(0, Math.min(totalPages - 1, currentPage + direction));
        renderPage(currentPage);
        // Scroll to deals section
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Initial render
    renderPage(currentPage);
}

// Load bestsellers
async function loadBestSellers() {
    const bestsellersContainer = document.getElementById('bestseller-container');
    if (!bestsellersContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products?sort_by=created_at&limit=20`);
        
        if (response.ok) {
            const result = await response.json();
            const products = result.data?.products || [];
            renderBestsellerSwiper(products, bestsellersContainer);
        } else {
            bestsellersContainer.innerHTML = '<p>No bestsellers available.</p>';
        }
    } catch (error) {
        console.error('Failed to load bestsellers:', error);
        bestsellersContainer.innerHTML = '<p>Error loading bestsellers.</p>';
    }
}

// Render bestseller swiper
function renderBestsellerSwiper(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<p>No products available.</p>';
        return;
    }

    let html = '';
    
    products.forEach(product => {
        const skuPrice = product.skus && product.skus.length > 0 ? parseFloat(product.skus[0].price) : 0;
        
        html += `
            <div class="swiper-slide">
                <div class="product-card">
                    <div class="product-image">
                        <a href="product.html?id=${product.id}">
                            <img src="${product.image_thumbnail || '/images/product-image.png'}" alt="${product.name}">
                        </a>
                        ${product.is_featured ? '<span class="badge">Featured</span>' : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-name">
                            <a href="product.html?id=${product.id}">${product.name}</a>
                        </div>
                        <div class="product-price">
                            <span class="price">$${skuPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Initialize Swiper
    if (typeof Swiper !== 'undefined') {
        setTimeout(() => {
            new Swiper('.mySwiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: false,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                },
            });
        }, 100);
    }
}

// Initialize advertisement animations and load featured products
async function initializeAdvertisements() {
    const adsContainer = document.getElementById('advertisements-container');
    if (!adsContainer) return;
    
    // Load featured products for advertisements
    try {
        const response = await fetch(`${API_BASE_URL}/products?is_featured=true&limit=10`);
        if (response.ok) {
            const result = await response.json();
            const products = result.data?.products || [];
            renderAdvertisements(products, adsContainer);
        } else {
            console.error('Failed to load featured products for ads');
        }
    } catch (error) {
        console.error('Failed to load featured products for ads:', error);
    }
}

// Render advertisements with product data
function renderAdvertisements(products, container) {
    if (!products || products.length < 2) {
        container.innerHTML = '<p>No featured products available.</p>';
        return;
    }
    
    // Get product data with fallbacks
    const product1 = products[0] || {};
    const product2 = products[1] || {};
    const product3 = products[2] || {};
    const product4 = products[3] || {};
    const product5 = products[4] || {};
    
    const price1 = product1.skus?.[0]?.price || 0;
    const price2 = product2.skus?.[0]?.price || 0;
    const price3 = product3.skus?.[0]?.price || 0;
    const price4 = product4.skus?.[0]?.price || 0;
    const price5 = product5.skus?.[0]?.price || 0;
    
    const html = `
        <div class="adv-grid-1">
            <div class="adv-1-1 adv advr-trans">
                <img src="${product1.image_thumbnail || '/images/watch_2.jpg'}" alt="${product1.name || ''}">
                <div class="text">
                    <h2>${product1.name || 'Featured Product'}</h2>
                    <p>${product1.description || 'Special Offer'}</p>
                </div>
                <button class="button" onclick="window.location.href='product.html?id=${product1.id}'">Shop Now</button>
            </div>
            <div class="adv-1-2 adv advl-trans">
                <img src="${product2.image_thumbnail || '/images/watch_1.jpg'}" alt="${product2.name || ''}">
                <div class="text">
                    <h2>${product2.name || 'Featured Product'}</h2>
                    <p>${product2.description || 'Limited Time Deal'}</p>
                </div>
                <button class="button" onclick="window.location.href='product.html?id=${product2.id}'">Shop Now</button>
            </div>
        </div>
        <div class="adv-grid-2">
            <div class="adv-2-1 adv advt-trans">
                <img src="${product3.image_thumbnail || '/images/products/macbook_pro_16.jpg'}" alt="${product3.name || ''}">
                <div class="text">
                    <h2>${product3.name || 'New Arrival'}</h2>
                    <p>${product3.description || 'Best Price'}</p>
                </div>
                <button class="button" onclick="window.location.href='product.html?id=${product3.id}'">Shop Now</button>
            </div>
            <div class="adv-2-2 adv advt-trans">
                <img src="${product4.image_thumbnail || '/images/products/s24_ultra.jpg'}" alt="${product4.name || ''}">
                <div class="text">
                    <h2>${product4.name || 'Hot Deal'}</h2>
                    <p>from</p>
                    <p class="price">$${parseFloat(price4).toFixed(2)}</p>
                </div>
                <button class="button" onclick="window.location.href='product.html?id=${product4.id}'">Shop Now</button>
            </div>
            <div class="adv-2-3 adv advt-trans">
                <img src="${product5.image_thumbnail || '/images/products/iphone_15.jpg'}" alt="${product5.name || ''}">
                <div class="text">
                    <p>Latest Model</p>
                    <h2>${product5.name || 'Top Rated'}</h2>
                </div>
                <button class="button" onclick="window.location.href='product.html?id=${product5.id}'">Shop Now</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add animation after render
    setTimeout(() => {
        const advElements = container.querySelectorAll('.adv');
        advElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('show');
            }, index * 200);
        });
    }, 100);
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
