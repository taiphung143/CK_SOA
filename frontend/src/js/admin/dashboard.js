const API_BASE_URL = 'http://localhost:3000/api';

// Get token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Check if user is admin
async function checkAdminAccess() {
    console.log('🔐 Checking admin access...');
    
    // First check stored user data
    const storedUserData = localStorage.getItem('userData');
    const token = getAuthToken();
    
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!storedUserData);
    
    if (storedUserData) {
        try {
            const userData = JSON.parse(storedUserData);
            console.log('User role from storage:', userData.role);
            
            if (userData.role === 'admin') {
                console.log('✅ Admin access granted from stored data');
                return true;
            } else {
                console.log('❌ User is not admin, role:', userData.role);
                alert('Access denied. Admin only.');
                window.location.href = '../view/login.html';
                return false;
            }
        } catch (error) {
            console.error('Error parsing stored user data:', error);
        }
    }

    // If no stored data, check token
    if (!token) {
        console.log('❌ No token found, redirecting to login');
        window.location.href = '../view/login.html';
        return false;
    }

    // Fallback to API verification
    try {
        console.log('📡 Verifying token with API...');
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        console.log('API response:', data);
        
        if (data.success && data.data.role === 'admin') {
            console.log('✅ Admin access granted from API');
            // Store user data for next time
            localStorage.setItem('userData', JSON.stringify(data.data));
            return true;
        } else {
            console.log('❌ API verification failed or not admin');
            alert('Access denied. Admin only.');
            window.location.href = '../view/login.html';
            return false;
        }
    } catch (error) {
        console.error('❌ Auth check failed:', error);
        alert('Authentication error. Please login again.');
        window.location.href = '../view/login.html';
        return false;
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    const token = getAuthToken();
    
    try {
        // Create statistics cards HTML
        const statisticsContainer = document.getElementById('statistics-container');
        statisticsContainer.innerHTML = `
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Total Users</h5>
                        <h2 id="total-users">0</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Total Orders</h5>
                        <h2 id="total-orders">0</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Total Products</h5>
                        <h2 id="total-products">0</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Total Revenue</h5>
                        <h2 id="total-revenue">$0</h2>
                    </div>
                </div>
            </div>
        `;

        // Create charts container HTML
        const chartsContainer = document.getElementById('charts-container');
        if (chartsContainer) {
            chartsContainer.innerHTML = `
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <h5>Revenue Overview</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5>Orders by Status</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="ordersChart"></canvas>
                        </div>
                    </div>
                </div>
            `;
        }

        // Fetch stats from multiple services with error handling
        console.log('Fetching dashboard stats...');
        
        const [usersRes, ordersRes, productsRes, revenueRes] = await Promise.all([
            fetch(`${API_BASE_URL}/users/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(err => {
                console.error('Failed to fetch users stats:', err);
                return { ok: false };
            }),
            fetch(`${API_BASE_URL}/orders/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(err => {
                console.error('Failed to fetch orders stats:', err);
                return { ok: false };
            }),
            fetch(`${API_BASE_URL}/products/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(err => {
                console.error('Failed to fetch products stats:', err);
                return { ok: false };
            }),
            fetch(`${API_BASE_URL}/orders/revenue`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(err => {
                console.error('Failed to fetch revenue stats:', err);
                return { ok: false };
            })
        ]);

        // Parse responses safely
        const users = usersRes.ok ? await usersRes.json() : { total: 0 };
        const orders = ordersRes.ok ? await ordersRes.json() : { total: 0, byStatus: {} };
        const products = productsRes.ok ? await productsRes.json() : { total: 0 };
        const revenue = revenueRes.ok ? await revenueRes.json() : { total: 0, monthly: [] };

        console.log('Stats loaded:', { users, orders, products, revenue });

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
        // Don't redirect on stats error, just show error message
        alert('Some statistics failed to load. Please refresh the page.');
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