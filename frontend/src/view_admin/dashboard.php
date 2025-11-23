<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Shop365</title>
    <link rel="stylesheet" href="admin_css/dashboard.css">
    <link rel="stylesheet" href="admin_css/product_manage.css">
    <link rel="stylesheet" href="admin_css/orders_manage.css">
    <link rel="stylesheet" href="admin_css/coupons_manage.css">
    <link rel="stylesheet" href="admin_css/users_manage.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body>
    <!-- Sidebar Navigation -->
    <div class="sidebar">
        <button class="sidebar-item" title="Menu">
            <i class="fas fa-bars"></i>
        </button>
        <button class="sidebar-item" title="Search">
            <i class="fas fa-search"></i>
        </button>
        <button class="sidebar-item active" data-page="" title="Home">
            <i class="fas fa-home"></i>
        </button>
        <button class="sidebar-item load-content" data-page="product_manage" title="Product">
            <i class="fa-solid fa-gift"></i>
        </button>
        <button class="sidebar-item" data-page="orders_manage" title="Orders">
            <i class="fa-solid fa-scroll"></i>
        </button>
        <button class="sidebar-item" data-page="coupons_manage" title="Coupons">
            <i class="fa-solid fa-ticket"></i>
        </button>
        <button class="sidebar-item" data-page="users_manage" title="Users">
            <i class="fas fa-users"></i>
        </button>
        <button class="sidebar-item" data-page="setting" title="Settings">
            <i class="fas fa-cog"></i>
        </button>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Header -->
        <div class="header">
            <div class="company-name">
                <i class="fas fa-at"></i>
                <span>Your Company</span>
            </div>
            <div class="user-info">
                <div class="notification-bell">
                    <i class="fas fa-bell"></i>
                    <span class="notification-count">2</span>
                </div>
                <button class="user-details-btn">
                    <div class="user-details">
                        <div class="user-name">Renee McKelvey</div>
                        <div class="user-role">Admin</div>
                    </div>
                </button>
                <button class="user-avatar">
                    <i class="fas fa-user"></i>
                </button>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-container">
            <div class="stat-card dark">
                <div class="stat-title">
                    <span>Total Sales</span>
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="stat-value">21,324</div>
                <div class="stat-change positive">+2,031</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">
                    <span>Total Income</span>
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-value">$221,324.50</div>
                <div class="stat-change negative">-32,201</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">
                    <span>Total Sessions</span>
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-value">16 703</div>
                <div class="stat-change positive">+3 392</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">
                    <span>Conversion Rate</span>
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-value">12.8%</div>
                <div class="stat-change positive">+1.22%</div>
            </div>
        </div>

        <!-- Sales & Income Trend Chart -->
        <div class="trend-chart-container">
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">Sales & Income Trends</div>
                    <button class="btn-icon">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
                <div class="category-legend">
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #333;"></div>
                        <span>Total Sales</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #ff6b6b;"></div>
                        <span>Total Income</span>
                    </div>
                </div>
                <div class="chart-container">
                    <!-- Area chart placeholder - in a real app, you'd use a chart library -->
                    <div style="width:100%; height:100%; background:#f8f9fa; position:relative;">
                        <svg width="100%" height="100%" viewBox="0 0 600 200">
                            <!-- Area chart paths -->
                            <path
                                d="M50,150 L100,140 L150,130 L200,120 L250,100 L300,110 L350,90 L400,80 L450,70 L500,60 L550,50 L550,180 L50,180 Z"
                                fill="#33333333" stroke="#333" stroke-width="2" />
                            <path
                                d="M50,160 L100,150 L150,155 L200,145 L250,130 L300,140 L350,120 L400,125 L450,115 L500,100 L550,90 L550,180 L50,180 Z"
                                fill="#ff6b6b33" stroke="#ff6b6b" stroke-width="2" />

                            <!-- Grid lines -->
                            <line x1="50" y1="40" x2="50" y2="180" stroke="#ddd" stroke-width="1" />
                            <line x1="150" y1="40" x2="150" y2="180" stroke="#ddd" stroke-width="1" />
                            <line x1="250" y1="40" x2="250" y2="180" stroke="#ddd" stroke-width="1" />
                            <line x1="350" y1="40" x2="350" y2="180" stroke="#ddd" stroke-width="1" />
                            <line x1="450" y1="40" x2="450" y2="180" stroke="#ddd" stroke-width="1" />
                            <line x1="50" y1="60" x2="550" y2="60" stroke="#ddd" stroke-width="1" />
                            <line x1="50" y1="100" x2="550" y2="100" stroke="#ddd" stroke-width="1" />
                            <line x1="50" y1="140" x2="550" y2="140" stroke="#ddd" stroke-width="1" />
                            <line x1="50" y1="180" x2="550" y2="180" stroke="#ddd" stroke-width="1" />

                            <!-- X-axis labels -->
                            <text x="50" y="195" font-size="12" text-anchor="middle">Jan</text>
                            <text x="150" y="195" font-size="12" text-anchor="middle">Mar</text>
                            <text x="250" y="195" font-size="12" text-anchor="middle">May</text>
                            <text x="350" y="195" font-size="12" text-anchor="middle">Jul</text>
                            <text x="450" y="195" font-size="12" text-anchor="middle">Sep</text>
                            <text x="550" y="195" font-size="12" text-anchor="middle">Nov</text>

                            <!-- Y-axis labels -->
                            <text x="40" y="60" font-size="10" text-anchor="end">$300k</text>
                            <text x="40" y="100" font-size="10" text-anchor="end">$200k</text>
                            <text x="40" y="140" font-size="10" text-anchor="end">$100k</text>
                            <text x="40" y="180" font-size="10" text-anchor="end">$0</text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts -->
        <div class="charts-container">
            <!-- Sales Performance Chart -->
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">Sales Performance</div>
                    <button class="btn-icon">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
                <div class="category-legend">
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #4b7bec;"></div>
                        <span>Laptops</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #3867d6;"></div>
                        <span>Tablets</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #2d98da;"></div>
                        <span>Monitors</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #45aaf2;"></div>
                        <span>Phones</span>
                    </div>
                </div>
                <div class="chart-container">
                    <!-- Line chart placeholder - in a real app, you'd use a chart library -->
                    <div style="width:100%; height:100%; background:#f8f9fa; position:relative;">
                        <svg width="100%" height="100%" viewBox="0 0 600 200">
                            <!-- Line chart paths would go here - simplified for this example -->
                            <path d="M50,150 Q150,50 250,120 T450,80" fill="none" stroke="#4b7bec" stroke-width="2" />
                            <path d="M50,100 Q150,30 250,90 T450,130" fill="none" stroke="#3867d6" stroke-width="2" />
                            <path d="M50,80 Q150,140 250,60 T450,100" fill="none" stroke="#2d98da" stroke-width="2" />
                            <path d="M50,130 Q150,100 250,130 T450,60" fill="none" stroke="#45aaf2" stroke-width="2" />

                            <!-- X-axis labels -->
                            <text x="50" y="190" font-size="12" text-anchor="middle">Jan</text>
                            <text x="165" y="190" font-size="12" text-anchor="middle">Feb</text>
                            <text x="280" y="190" font-size="12" text-anchor="middle">Mar</text>
                            <text x="395" y="190" font-size="12" text-anchor="middle">Apr</text>
                            <text x="510" y="190" font-size="12" text-anchor="middle">May</text>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Popular Categories Chart -->
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">Popular Categories</div>
                </div>
                <div class="category-legend">
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #333;"></div>
                        <span>Electronics</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #777;"></div>
                        <span>Furniture</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background-color: #ccc;"></div>
                        <span>Toys</span>
                    </div>
                </div>
                <div class="chart-container">
                    <!-- Bar chart placeholder - in a real app, you'd use a chart library -->
                    <div
                        style="width:100%; height:100%; display:flex; align-items:flex-end; justify-content:space-around; padding-top:20px;">
                        <div class="bar-chart-column">
                            <div style="width:40px; height:120px; background-color:#333; margin-bottom:10px;"></div>
                            <div style="text-align:center; font-size:12px;">Electronics</div>
                        </div>
                        <div class="bar-chart-column">
                            <div style="width:40px; height:80px; background-color:#777; margin-bottom:10px;"></div>
                            <div style="text-align:center; font-size:12px;">Furniture</div>
                        </div>
                        <div class="bar-chart-column">
                            <div style="width:40px; height:50px; background-color:#ccc; margin-bottom:10px;"></div>
                            <div style="text-align:center; font-size:12px;">Toys</div>
                        </div>
                        <div class="bar-chart-column">
                            <div style="width:40px; height:65px; background-color:#999; margin-bottom:10px;"></div>
                            <div style="text-align:center; font-size:12px;">Clothing</div>
                        </div>
                        <div class="bar-chart-column">
                            <div style="width:40px; height:90px; background-color:#555; margin-bottom:10px;"></div>
                            <div style="text-align:center; font-size:12px;">Books</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Customers Table -->
        <div class="table-card">
            <div class="table-header">
                <div class="table-title">Recent Customers</div>
                <button class="btn-icon">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Order Date</th>
                        <th>Phone Number</th>
                        <th>Location</th>
                        <th>Registered</th>
                        <th colspan="2"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Jerry Mattedi</td>
                        <td>19 May, 2023 - 10:30 AM</td>
                        <td>254-661-5362</td>
                        <td>New York</td>
                        <td>Yes</td>
                        <td><a href="#" class="btn-link">Options</a></td>
                        <td><a href="#" class="btn-link">Details</a></td>
                    </tr>
                    <tr>
                        <td>Elianora Vasilov</td>
                        <td>18 May, 2023 - 3:12 PM</td>
                        <td>171-534-1262</td>
                        <td>Ontario</td>
                        <td>No</td>
                        <td><a href="#" class="btn-link">Options</a></td>
                        <td><a href="#" class="btn-link">Details</a></td>
                    </tr>
                    <tr>
                        <td>Alvis Daen</td>
                        <td>17 May, 2023 - 2:15 PM</td>
                        <td>974-661-5110</td>
                        <td>Milan</td>
                        <td>Yes</td>
                        <td><a href="#" class="btn-link">Options</a></td>
                        <td><a href="#" class="btn-link">Details</a></td>
                    </tr>
                    <tr>
                        <td>Lissa Shigney</td>
                        <td>23 Apr, 2023 - 1:15 PM</td>
                        <td>541-661-3042</td>
                        <td>San Francisco</td>
                        <td>Yes</td>
                        <td><a href="#" class="btn-link">Options</a></td>
                        <td><a href="#" class="btn-link">Details</a></td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <div class="page-number">1</div>
                <div class="page-number active">2</div>
                <div class="page-number">3</div>
                <div class="page-number">4</div>
                <div class="page-number">5</div>
                <div class="page-number">...</div>
                <div class="page-number">20</div>
            </div>
        </div>
    </div>
    <script src="admin_js/dashboard.js"></script>
    <script src="admin_js/product_manage.js"></script>
    <script src="admin_js/orders_manage.js"></script>
    <script src="admin_js/coupons_manage.js"></script>
    <script src="admin_js/users_manage.js"></script>
</body>

</html>