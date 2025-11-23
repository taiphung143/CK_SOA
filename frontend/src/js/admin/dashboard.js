const API_BASE_URL = 'http://localhost:3000/api';

// Get token from localStorage
function getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Check if user is admin
async function checkAdminAccess() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '../view/login.html';
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (!data.success || data.user.role !== 'admin') {
            alert('Access denied. Admin only.');
            window.location.href = '../view/home.html';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '../view/login.html';
        return false;
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    const token = getAuthToken();
    
    try {
        // Fetch stats from multiple services
        const [usersRes, ordersRes, productsRes, revenueRes] = await Promise.all([
            fetch(`${API_BASE_URL}/users/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`${API_BASE_URL}/orders/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`${API_BASE_URL}/products/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`${API_BASE_URL}/orders/revenue`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        const users = await usersRes.json();
        const orders = await ordersRes.json();
        const products = await productsRes.json();
        const revenue = await revenueRes.json();

        // Update stat cards
        document.getElementById('total-users').textContent = users.total || 0;
        document.getElementById('total-orders').textContent = orders.total || 0;
        document.getElementById('total-products').textContent = products.total || 0;
        document.getElementById('total-revenue').textContent = `$${(revenue.total || 0).toLocaleString()}`;

        // Load charts
        loadRevenueChart(revenue.monthly || []);
        loadOrdersChart(orders.byStatus || {});
        
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

// Load revenue chart (using Chart.js)
function loadRevenueChart(monthlyData) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.map(d => d.month),
            datasets: [{
                label: 'Revenue',
                data: monthlyData.map(d => d.amount),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}

// Load orders chart
function loadOrdersChart(ordersByStatus) {
    const ctx = document.getElementById('ordersChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(ordersByStatus),
            datasets: [{
                data: Object.values(ordersByStatus),
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ]
            }]
        }
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    if (await checkAdminAccess()) {
        loadDashboardStats();
    }
});