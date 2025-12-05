const API_BASE_URL = 'http://localhost:3000/api';

function getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Load all products
async function loadProducts() {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/products?limit=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        console.log('Products API Response:', data);
        
        if (data.success) {
            // API returns data.data.products (array) or data.products or data.data
            const products = data.data?.products || data.products || data.data || [];
            displayProducts(products);
        } else {
            console.error('API returned error:', data);
            alert('Failed to load products: ' + (data.error?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Failed to load products:', error);
        alert('Network error: ' + error.message);
    }
}

// Display products in table
function displayProducts(products) {
    const container = document.getElementById('products-table-container');
    
    if (!container) {
        console.error('Container element not found');
        return;
    }
    
    // Ensure products is an array
    if (!Array.isArray(products)) {
        console.error('Products is not an array:', products);
        products = [];
    }
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No products found</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Featured</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.id}</td>
                            <td><img src="${product.image_thumbnail || '/images/default-product.png'}" width="50" height="50" alt="${product.name}"></td>
                            <td>${product.name}</td>
                            <td>${product.category_name || 'N/A'}</td>
                            <td>
                                <span class="badge bg-${product.active ? 'success' : 'danger'}">
                                    ${product.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>${product.is_featured ? 'Yes' : 'No'}</td>
                            <td>${new Date(product.created_at).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-info" onclick="viewProduct(${product.id})">View</button>
                                <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Show add product modal
document.getElementById('add-product-btn')?.addEventListener('click', () => {
    showAddProductModal();
});

// Show add product form
function showAddProductModal() {
    const modalBody = document.getElementById('product-modal-body');
    
    modalBody.innerHTML = `
        <form id="add-product-form">
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label">Product Name *</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                
                <div class="col-md-6 mb-3">
                    <label class="form-label">Category *</label>
                    <select name="sub_category_id" class="form-select" required id="add-category-select">
                        <option value="">Select Category</option>
                    </select>
                </div>
                
                <div class="col-md-6 mb-3">
                    <label class="form-label">Thumbnail Image URL</label>
                    <input type="text" name="image_thumbnail" class="form-control" placeholder="/images/products/product.jpg">
                </div>
                
                <div class="col-md-12 mb-3">
                    <label class="form-label">Description *</label>
                    <textarea name="description" class="form-control" rows="3" required></textarea>
                </div>
                
                <div class="col-md-12 mb-3">
                    <label class="form-label">Additional Description</label>
                    <textarea name="description_2" class="form-control" rows="2"></textarea>
                </div>
                
                <div class="col-md-12 mb-3">
                    <div class="form-check">
                        <input type="checkbox" name="is_featured" class="form-check-input" id="is-featured-check" value="1">
                        <label class="form-check-label" for="is-featured-check">
                            Featured Product
                        </label>
                    </div>
                </div>
                
                <div class="col-md-12 mb-3">
                    <h6>Product Variants (SKUs)</h6>
                    <div id="sku-list">
                        <div class="sku-item border rounded p-3 mb-2">
                            <div class="row">
                                <div class="col-md-4 mb-2">
                                    <label class="form-label">Variant Name (e.g., Red-M) *</label>
                                    <input type="text" class="form-control sku-name" placeholder="Red-Medium" required>
                                </div>
                                <div class="col-md-2 mb-2">
                                    <label class="form-label">Price *</label>
                                    <input type="number" class="form-control sku-price" step="0.01" min="0" placeholder="29.99" required>
                                </div>
                                <div class="col-md-2 mb-2">
                                    <label class="form-label">Stock *</label>
                                    <input type="number" class="form-control sku-stock" min="0" placeholder="100" required>
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label">Image URL</label>
                                    <input type="text" class="form-control sku-image" placeholder="/images/products/variant.jpg">
                                </div>
                                <div class="col-md-1 mb-2">
                                    <label class="form-label">&nbsp;</label>
                                    <button type="button" class="btn btn-danger btn-sm w-100 remove-sku">×</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary" id="add-sku-btn">
                        <i class="fas fa-plus"></i> Add Variant
                    </button>
                </div>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Product</button>
            </div>
        </form>
    `;
    
    // Load categories into select
    loadCategoriesForForm('add-category-select');
    
    // Handle add SKU button
    document.getElementById('add-sku-btn').addEventListener('click', () => {
        const skuList = document.getElementById('sku-list');
        const skuItem = document.createElement('div');
        skuItem.className = 'sku-item border rounded p-3 mb-2';
        skuItem.innerHTML = `
            <div class="row">
                <div class="col-md-4 mb-2">
                    <label class="form-label">Variant Name *</label>
                    <input type="text" class="form-control sku-name" placeholder="Blue-Large" required>
                </div>
                <div class="col-md-2 mb-2">
                    <label class="form-label">Price *</label>
                    <input type="number" class="form-control sku-price" step="0.01" min="0" placeholder="29.99" required>
                </div>
                <div class="col-md-2 mb-2">
                    <label class="form-label">Stock *</label>
                    <input type="number" class="form-control sku-stock" min="0" placeholder="100" required>
                </div>
                <div class="col-md-3 mb-2">
                    <label class="form-label">Image URL</label>
                    <input type="text" class="form-control sku-image" placeholder="/images/products/variant.jpg">
                </div>
                <div class="col-md-1 mb-2">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-danger btn-sm w-100 remove-sku">×</button>
                </div>
            </div>
        `;
        skuList.appendChild(skuItem);
    });
    
    // Handle remove SKU button (using event delegation)
    document.getElementById('sku-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-sku')) {
            const skuList = document.getElementById('sku-list');
            if (skuList.children.length > 1) {
                e.target.closest('.sku-item').remove();
            } else {
                alert('At least one variant is required');
            }
        }
    });
    
    // Handle form submission
    document.getElementById('add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleAddProduct(e.target);
    });
    
    // Show modal without backdrop, we'll handle it manually
    const modalElement = document.getElementById('productModal');
    const modal = new bootstrap.Modal(modalElement, {
        backdrop: false,
        keyboard: true,
        focus: true
    });
    
    // Add custom close handlers
    const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.hide();
            cleanupBackdrops();
        }, { once: true });
    });
    
    modal.show();
}

// Handle add product submission
async function handleAddProduct(form) {
    const token = getAuthToken();
    
    // Collect form data
    const formData = new FormData(form);
    const productData = {
        name: formData.get('name'),
        sub_category_id: parseInt(formData.get('sub_category_id')),
        category_id: parseInt(formData.get('sub_category_id')), // Same as sub_category_id for now
        description: formData.get('description'),
        description_2: formData.get('description_2') || '',
        image_thumbnail: formData.get('image_thumbnail') || '/images/default-product.png',
        is_featured: formData.get('is_featured') ? true : false,
        skus: []
    };
    
    // Collect SKU data
    const skuItems = document.querySelectorAll('.sku-item');
    skuItems.forEach(item => {
        const sku = {
            sku: item.querySelector('.sku-name').value,
            price: parseFloat(item.querySelector('.sku-price').value),
            stock: parseInt(item.querySelector('.sku-stock').value),
            image: item.querySelector('.sku-image').value || productData.image_thumbnail
        };
        productData.skus.push(sku);
    });
    
    console.log('Creating product:', productData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert('Product created successfully!');
            form.reset();
            loadProducts();
            // Properly close modal and remove backdrop
            const modalElement = document.getElementById('productModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
                setTimeout(() => {
                    cleanupBackdrops();
                }, 100);
            }
        } else {
            alert('Failed to create product: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Failed to create product:', error);
        alert('Network error: ' + error.message);
    }
}

// View product details
async function viewProduct(productId) {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        console.log('Product details response:', data);
        
        if (data.success) {
            showProductDetailsModal(data.data);
        } else {
            alert('Failed to load product details: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Failed to load product details:', error);
        alert('Network error: ' + error.message);
    }
}

// Show product details in modal
function showProductDetailsModal(product) {
    const modalBody = document.getElementById('product-modal-body');
    
    const skus = product.skus || [];
    
    modalBody.innerHTML = `
        <div class="product-details">
            <div class="row">
                <div class="col-md-4">
                    <img src="${product.image_thumbnail || '/images/default-product.png'}" 
                         alt="${product.name}" class="img-fluid rounded">
                </div>
                <div class="col-md-8">
                    <h4>${product.name}</h4>
                    <p><strong>ID:</strong> ${product.id}</p>
                    <p><strong>Category:</strong> ${product.category?.name || 'N/A'}</p>
                    <p><strong>Status:</strong> 
                        <span class="badge bg-${product.active ? 'success' : 'danger'}">
                            ${product.active ? 'Active' : 'Inactive'}
                        </span>
                    </p>
                    <p><strong>Featured:</strong> ${product.is_featured ? 'Yes' : 'No'}</p>
                    <p><strong>Created:</strong> ${new Date(product.created_at).toLocaleString()}</p>
                </div>
            </div>
            
            <div class="mt-3">
                <h6>Description</h6>
                <p>${product.description || 'No description'}</p>
                ${product.description_2 ? `<p>${product.description_2}</p>` : ''}
            </div>
            
            <div class="mt-3">
                <h6>Product Variants (${skus.length})</h6>
                ${skus.length > 0 ? `
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${skus.map(sku => `
                                    <tr>
                                        <td>${sku.sku}</td>
                                        <td>$${parseFloat(sku.price).toFixed(2)}</td>
                                        <td>${sku.stock}</td>
                                        <td>
                                            <img src="${sku.image}" alt="${sku.sku}" 
                                                 style="width: 40px; height: 40px; object-fit: cover;">
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : '<p class="text-muted">No variants available</p>'}
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    `;
    
    // Show modal without backdrop, we'll handle it manually
    const modalElement = document.getElementById('productModal');
    const modal = new bootstrap.Modal(modalElement, {
        backdrop: false,
        keyboard: true,
        focus: true
    });
    
    // Add custom close handler for the close button
    const closeBtn = modalBody.querySelector('[data-bs-dismiss="modal"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.hide();
            setTimeout(cleanupBackdrops, 100);
        }, { once: true });
    }
    
    modal.show();
}

// Edit product
async function editProduct(productId) {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            // Populate edit form
            const form = document.getElementById('edit-product-form');
            Object.keys(data.product).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) input.value = data.product[key];
            });
            
            // Show edit modal
            const modalElement = document.getElementById('editProductModal');
            const modal = new bootstrap.Modal(modalElement, {
                backdrop: false,
                keyboard: true,
                focus: true
            });
            
            // Add close handler
            modalElement.addEventListener('hidden.bs.modal', () => {
                cleanupBackdrops();
            }, { once: true });
            
            modal.show();
            
            // Store product ID for update
            form.dataset.productId = productId;
        }
    } catch (error) {
        console.error('Failed to load product:', error);
    }
}

// Update product
document.getElementById('edit-product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    const productId = e.target.dataset.productId;
    
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            alert('Product updated successfully');
            loadProducts();
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        }
    } catch (error) {
        console.error('Failed to update product:', error);
    }
});

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            alert('Product deleted successfully');
            loadProducts();
        }
    } catch (error) {
        console.error('Failed to delete product:', error);
    }
}

// Load categories for dropdown
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        const data = await response.json();
        
        console.log('Categories response:', data);
        
        if (data.success) {
            const filterSelect = document.getElementById('category-filter');
            if (filterSelect) {
                // data.data is an array of categories
                const categories = Array.isArray(data.data) ? data.data : [];
                filterSelect.innerHTML = '<option value="">All Categories</option>' + 
                    categories.map(cat => 
                        `<option value="${cat.id}">${cat.name}</option>`
                    ).join('');
            }
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

// Load categories for form (includes subcategories)
async function loadCategoriesForForm(selectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById(selectId);
            if (select) {
                let options = '<option value="">Select Category</option>';
                
                // data.data is an array of categories with subcategories
                const categories = Array.isArray(data.data) ? data.data : [];
                categories.forEach(cat => {
                    if (cat.subcategories && cat.subcategories.length > 0) {
                        options += `<optgroup label="${cat.name}">`;
                        cat.subcategories.forEach(sub => {
                            options += `<option value="${sub.id}">${sub.name}</option>`;
                        });
                        options += `</optgroup>`;
                    } else {
                        // If no subcategories, just show the main category
                        options += `<option value="${cat.id}">${cat.name}</option>`;
                    }
                });
                
                select.innerHTML = options;
            }
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

// Clean up any leftover backdrops
function cleanupBackdrops() {
    // Remove all modal backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
        backdrop.classList.remove('show');
        backdrop.remove();
    });
    
    // Reset body styles
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Remove any inline styles that might have been added
    document.body.removeAttribute('style');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCategories();
    
    // Clean up any leftover backdrops on page load
    cleanupBackdrops();
    
    // Clean up backdrops when modal is hidden
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('hidden.bs.modal', cleanupBackdrops);
    }
});