<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Product Management</title>
  <link rel="stylesheet" href="admin_css/product_manage.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body>
  <div class="sidebar">
    <button class="sidebar-item" title="Menu">
      <i class="fas fa-bars"></i>
    </button>
    <button class="sidebar-item" title="Search">
      <i class="fas fa-search"></i>
    </button>
    <a href="admin.php" class="sidebar-item" title="Home">
      <i class="fas fa-home"></i>
    </a>
    <a href="admin.php?page=product_manage" class="sidebar-item active" title="Product">
      <i class="fa-solid fa-gift"></i>
    </a>
    <button class="sidebar-item" title="Orders">
      <i class="fa-solid fa-scroll"></i>
    </button>
    <button class="sidebar-item" title="Coupons">
      <i class="fa-solid fa-ticket"></i>
    </button>
    <button class="sidebar-item" title="Users">
      <i class="fas fa-users"></i>
    </button>
    <button class="sidebar-item" title="Settings">
      <i class="fas fa-cog"></i>
    </button>
  </div>

  <div class="main-content">
    <div class="header">
      <h1><i class="fas fa-box"></i> Product Management</h1>
    </div>

    <div class="form-container">
      <div class="input-group">
        <div class="input-row">
          <div class="form-input">
            <input type="text" id="name" placeholder="Product Name">
          </div>
          <div class="form-input">
            <input type="number" id="price" placeholder="Price">
          </div>
        </div>
        <div class="input-row">
          <div class="form-input">
            <input type="text" id="pId" placeholder="Product ID" readonly>
          </div>
          <div class="form-input">
            <button class="btn-add" onclick="addProduct()">Add Product</button>
            <button class="btn-cancel" onclick="cancelEdit()" style="display:none;">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table id="productTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>SKU</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Product list will be displayed here -->
        </tbody>
      </table>
    </div>

    <!-- Modal Edit Dialog -->
    <div id="editModal" class="modal">
      <div class="modal-content">
        <span class="close-button" onclick="closeModal()">&times;</span>
        <h2><i class="fas fa-edit"></i> Edit Product</h2>
        <div class="modal-form">
          <div class="form-group">
            <label for="editName">Product Name</label>
            <input type="text" id="editName" placeholder="Product Name">
          </div>
          <div class="form-group">
            <label for="editPrice">Price</label>
            <input type="number" id="editPrice" placeholder="Price">
          </div>
          <div class="form-group">
            <label for="editSku">SKU Code</label>
            <input type="text" id="editSku" placeholder="SKU Code">
          </div>
          <div class="form-actions">
            <button class="btn-update" onclick="updateProduct()">Update</button>
            <button class="btn-cancel" onclick="closeModal()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
