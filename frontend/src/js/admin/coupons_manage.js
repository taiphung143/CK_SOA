const API_BASE_URL = 'http://localhost:3000/api';

function getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Load all vouchers/coupons
async function loadCoupons() {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/vouchers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            displayCoupons(data.vouchers);
        }
    } catch (error) {
        console.error('Failed to load coupons:', error);
    }
}

// Display coupons in table
function displayCoupons(coupons) {
    const tbody = document.getElementById('coupons-table-body');
    tbody.innerHTML = coupons.map(coupon => {
        const now = new Date();
        const startDate = new Date(coupon.start_at);
        const endDate = new Date(coupon.end_at);
        const isActive = now >= startDate && now <= endDate;
        
        return `
            <tr>
                <td>${coupon.id}</td>
                <td><strong>${coupon.code}</strong></td>
                <td>${coupon.discount_percent}%</td>
                <td>${new Date(coupon.start_at).toLocaleDateString()}</td>
                <td>${new Date(coupon.end_at).toLocaleDateString()}</td>
                <td>
                    <span class="badge bg-${isActive ? 'success' : 'secondary'}">
                        ${isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editCoupon(${coupon.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCoupon(${coupon.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Add new coupon
document.getElementById('add-coupon-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    
    const formData = new FormData(e.target);
    const couponData = Object.fromEntries(formData);
    
    // Validate discount percent
    if (couponData.discount_percent < 1 || couponData.discount_percent > 100) {
        alert('Discount percent must be between 1 and 100');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/vouchers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(couponData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            alert('Coupon created successfully');
            e.target.reset();
            loadCoupons();
            bootstrap.Modal.getInstance(document.getElementById('addCouponModal'))?.hide();
        } else {
            alert(data.message || 'Failed to create coupon');
        }
    } catch (error) {
        console.error('Failed to add coupon:', error);
        alert('Failed to create coupon');
    }
});

// Edit coupon
async function editCoupon(couponId) {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/vouchers/${couponId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            const form = document.getElementById('edit-coupon-form');
            
            // Populate form fields
            form.querySelector('[name="code"]').value = data.voucher.code;
            form.querySelector('[name="discount_percent"]').value = data.voucher.discount_percent;
            form.querySelector('[name="start_at"]').value = data.voucher.start_at.split('T')[0];
            form.querySelector('[name="end_at"]').value = data.voucher.end_at.split('T')[0];
            
            // Store coupon ID
            form.dataset.couponId = couponId;
            
            // Show edit modal
            const modal = new bootstrap.Modal(document.getElementById('editCouponModal'));
            modal.show();
        }
    } catch (error) {
        console.error('Failed to load coupon:', error);
    }
}

// Update coupon
document.getElementById('edit-coupon-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    const couponId = e.target.dataset.couponId;
    
    const formData = new FormData(e.target);
    const couponData = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/vouchers/${couponId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(couponData)
        });
        
        if (response.ok) {
            alert('Coupon updated successfully');
            loadCoupons();
            bootstrap.Modal.getInstance(document.getElementById('editCouponModal')).hide();
        }
    } catch (error) {
        console.error('Failed to update coupon:', error);
    }
});

// Delete coupon
async function deleteCoupon(couponId) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/vouchers/${couponId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            alert('Coupon deleted successfully');
            loadCoupons();
        }
    } catch (error) {
        console.error('Failed to delete coupon:', error);
    }
}

// Generate random coupon code
function generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Add generate button functionality
document.getElementById('generate-code-btn')?.addEventListener('click', () => {
    document.getElementById('coupon-code').value = generateCouponCode();
});

// Initialize
document.addEventListener('DOMContentLoaded', loadCoupons);