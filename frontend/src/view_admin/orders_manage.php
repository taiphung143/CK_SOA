<div class="main-content">
  <div class="header">
    <h1><i class="fas fa-receipt"></i> Order Management</h1>
  </div>

  <div class="controls-container">
    <div class="search-box">
      <i class="fas fa-search"></i>
      <input type="text" id="searchOrders" placeholder="Search orders...">
    </div>
    <div>
      <select class="filter-dropdown" id="statusFilter">
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  </div>

  <div class="table-container">
    <table id="orderTable">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Order Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Order list will be added via JavaScript -->
      </tbody>
    </table>
  </div>
</div>
