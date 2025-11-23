<div class="main-content">
  <div class="header">
    <h1><i class="fas fa-ticket-alt"></i> Coupon Management</h1>
    <button class="btn-add" onclick="addCoupon()">+ Add Coupon</button>
  </div>

  <div class="controls-container">
    <div class="search-box">
      <i class="fas fa-search"></i>
      <input type="text" id="searchCoupons" placeholder="Search coupons...">
    </div>
    <div>
      <select id="typeFilter" class="filter-dropdown">
        <option value="all">All types</option>
        <option value="percent">Percentage</option>
        <option value="fixed">Fixed price</option>
      </select>
    </div>
  </div>

  <div class="table-container">
    <table id="couponTable">
      <thead>
        <tr>
          <th>Code</th>
          <th>Type</th>
          <th>Value</th>
          <th>Expiry date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Coupon data will be rendered by JS -->
      </tbody>
    </table>
  </div>
</div>
