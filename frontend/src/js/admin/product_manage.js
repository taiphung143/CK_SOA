const API_BASE_URL = 'http://localhost:3000/api';

function getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Load all products
async function loadProducts() {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/products?limit=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

// Display products in table
function displayProducts(products) {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image_thumbnail || '/images/default-product.png'}" width="50" height="50"></td>
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
    `).join('');
}

// Add new product
document.getElementById('add-product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            alert('Product added successfully');
            e.target.reset();
            loadProducts();
            // Close modal if using one
            bootstrap.Modal.getInstance(document.getElementById('addProductModal'))?.hide();
        }
    } catch (error) {
        console.error('Failed to add product:', error);
    }
});

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
            const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
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
        
        if (data.success) {
            const selects = document.querySelectorAll('select[name="category_id"]');
            selects.forEach(select => {
                select.innerHTML = '<option value="">Select Category</option>' + 
                    data.categories.map(cat => 
                        `<option value="${cat.id}">${cat.name}</option>`
                    ).join('');
            });
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCategories();
});