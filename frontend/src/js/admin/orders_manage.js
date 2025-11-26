const API_BASE_URL = 'http://localhost:3000/api';

function getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Load all orders
async function loadOrders(status = '') {
    // Handle case where event object is passed instead of string
    if (status && typeof status === 'object' && status.target) {
        status = status.target.value;
    }
    
    const token = getAuthToken();
    
    try {
        const url = status ? `${API_BASE_URL}/orders?status=${status}` : `${API_BASE_URL}/orders`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        console.log('Orders API Response:', data);
        
        if (data.success) {
            // API returns data.data.orders (array) or data.orders or data.data
            const orders = data.data?.orders || data.orders || data.data || [];
            displayOrders(orders);
        } else {
            console.error('API returned error:', data);
            alert('Failed to load orders: ' + (data.error?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        alert('Network error: ' + error.message);
    }
}

// Display orders in table
function displayOrders(orders) {
    const container = document.getElementById('orders-table-container');
    
    if (!container) {
        console.error('Container element not found');
        return;
    }
    
    // Ensure orders is an array
    if (!Array.isArray(orders)) {
        console.error('Orders is not an array:', orders);
        orders = [];
    }
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No orders found</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${order.user_name || 'N/A'}</td>
                            <td>\$${parseFloat(order.total).toFixed(2)}</td>
                            <td>
                                <span class="badge bg-${getStatusColor(order.status)}">
                                    ${order.status}
                                </span>
                            </td>
                            <td>${new Date(order.created_at).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-info" onclick="viewOrder(${order.id})"><i class="fas fa-eye"></i></button>
                                <select class="form-select form-select-sm d-inline-block w-auto" 
                                        onchange="updateOrderStatus(${order.id}, this.value)">
                                    <option value="">Change Status</option>
                                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
                                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Get status badge color
function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'paid': 'info',
        'shipped': 'primary',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;
    
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            alert('Order status updated successfully');
            loadOrders();
        }
    } catch (error) {
        console.error('Failed to update order status:', error);
    }
}

// View order details
async function viewOrder(orderId) {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            // Show modal with order details
            showOrderDetailsModal(data.order);
        }
    } catch (error) {
        console.error('Failed to load order details:', error);
    }
}

// Show order details in modal
function showOrderDetailsModal(order) {
    const modalBody = document.getElementById('order-details-body');
    modalBody.innerHTML = `
        <h5>Order #${order.id}</h5>
        <p><strong>Customer:</strong> ${order.user_name}</p>
        <p><strong>Total:</strong> \$${parseFloat(order.total).toFixed(2)}</p>
        <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        
        <h6 class="mt-3">Order Items:</h6>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Product SKU</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.product_sku_id}</td>
                        <td>${item.quantity}</td>
                        <td>\$${parseFloat(item.price).toFixed(2)}</td>
                        <td>\$${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Show Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
}

// Filter orders by status
document.getElementById('status-filter')?.addEventListener('change', (e) => {
    loadOrders(e.target.value);
});

// Initialize
document.addEventListener('DOMContentLoaded', loadOrders);