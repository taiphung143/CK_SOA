<?php
// Include header and any necessary session handling
include_once 'header.php';


// Get user data from session or use data passed from controller
$user = isset($data['user']) ? $data['user'] : (isset($_SESSION['user']) ? $_SESSION['user'] : null);

// Check for messages/alerts
$successMessage = isset($_SESSION['success_message']) ? $_SESSION['success_message'] : '';
$errorMessage = isset($_SESSION['error_message']) ? $_SESSION['error_message'] : '';

// Clear messages after displaying
if (isset($_SESSION['success_message'])) unset($_SESSION['success_message']);
if (isset($_SESSION['error_message'])) unset($_SESSION['error_message']);

// Parse name into first and last name for the form
$nameParts = explode(' ', $user['name']);
$lastName = array_pop($nameParts);
$firstName = implode(' ', $nameParts);
?>

<div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="index.php">Home</a>
            <span>/</span>
            <span class="current">Profile</span>
    </div>
</div>

<?php if($successMessage): ?>
<div class="alert alert-success"><?php echo $successMessage; ?></div>
<?php endif; ?>

<?php if($errorMessage): ?>
<div class="alert alert-danger"><?php echo $errorMessage; ?></div>
<?php endif; ?>

<div class="container profile-container">
    <div class="wh-box">


        <!-- Main content section with sidebar and form -->
        <div class="profile-main-section">
            <!-- Sidebar with profile info -->
            <div class="profile-sidebar">
                <div class="profile-img">
                    <img src="<?php echo !empty($user['avatar']) ? $user['avatar'] : '../public/images/tai.jpg'; ?>" alt="Profile Avatar">
                </div>
                <h5 class="profile-name"><?php echo htmlspecialchars($user['name']); ?></h5>
                <div class="profile-email"><?php echo htmlspecialchars($user['email']); ?></div>
                  <!-- Navigation tabs -->
                <div class="profile-nav">
                    <a href="index.php?page=profile&section=info" class="profile-nav-btn <?php echo (!isset($_GET['section']) || $_GET['section'] == 'info') ? 'active' : ''; ?>">
                        <span>Account info</span>
                        <i class="fas fa-user"></i>
                    </a>
                    <a href="index.php?page=profile&section=orders" class="profile-nav-btn <?php echo (isset($_GET['section']) && $_GET['section'] == 'orders') ? 'active' : ''; ?>">
                        <span>My orders</span>
                        <i class="fas fa-shopping-bag"></i>
                    </a>
                    <a href="index.php?page=profile&section=address" class="profile-nav-btn <?php echo (isset($_GET['section']) && $_GET['section'] == 'address') ? 'active' : ''; ?>">
                        <span>My address</span>
                        <i class="fas fa-map-marker-alt"></i>
                    </a>
                    <a href="index.php?page=profile&section=password" class="profile-nav-btn <?php echo (isset($_GET['section']) && $_GET['section'] == 'password') ? 'active' : ''; ?>">
                        <span>Change password</span>
                        <i class="fas fa-lock"></i>
                    </a>
                    <a href="index.php?page=profile&section=wishlist" class="profile-nav-btn <?php echo (isset($_GET['section']) && $_GET['section'] == 'wishlist') ? 'active' : ''; ?>">
                        <span>My wishlist</span>
                        <i class="fas fa-heart"></i>
                    </a>
                </div>
            </div>
              <!-- Form section -->
            <div class="profile-content">
                <?php 
                // Use the section from controller if available, otherwise get from URL
                $section = isset($data['section']) ? $data['section'] : (isset($_GET['section']) ? $_GET['section'] : 'info');
                
                // Display different content based on selected section
                switch($section) {
                    case 'info':
                        echo '<h4 class="content-title">Account Info</h4>';
                        ?>
                        <form action="index.php?page=controller/profile&action=update" method="post" class="profile-form" enctype="multipart/form-data">
                            <div class="form-group avatar-upload-group">
                                <label for="avatarUpload">Profile Picture</label>
                                <div class="avatar-preview">
                                    <img src="<?php echo !empty($user['avatar']) ? $user['avatar'] : '../public/images/tai.jpg'; ?>" alt="Profile Avatar" id="avatarPreview">
                                </div>
                                <div class="upload-controls">
                                    <input type="file" class="form-control-file" id="avatarUpload" name="avatar" accept="image/*">
                                    <small class="form-text text-muted">Recommended: Square image, max 2MB</small>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="firstName">First Name *</label>
                                <input type="text" class="form-control" id="firstName" name="firstName" value="<?php echo htmlspecialchars($firstName); ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="lastName">Last Name *</label>
                                <input type="text" class="form-control" id="lastName" name="lastName" value="<?php echo htmlspecialchars($lastName); ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email Address *</label>
                                <input type="email" class="form-control" id="email" value="<?php echo htmlspecialchars($user['email']); ?>" readonly>
                                <small class="form-text text-muted">Email cannot be changed</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="birth">Birth Date</label>
                                <input type="date" class="form-control" id="birth" name="birth" value="<?php echo isset($user['birth']) ? $user['birth'] : ''; ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="text" class="form-control" id="phone" name="phone_number" value="<?php echo isset($user['phone_number']) ? htmlspecialchars($user['phone_number']) : ''; ?>">
                            </div>
                            
                            <button type="submit" class="save-btn">Save Changes</button>
                        </form>
                        <?php
                        break;
                        
                    case 'password':
                        echo '<h4 class="content-title">Change Password</h4>';
                        ?>
                        <form action="index.php?page=controller/profile" method="post" class="profile-form">
                            <div class="form-group">
                                <label for="currentPassword">Current Password *</label>
                                <input type="password" class="form-control" id="currentPassword" name="current_password" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="newPassword">New Password *</label>
                                <input type="password" class="form-control" id="newPassword" name="new_password" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password *</label>
                                <input type="password" class="form-control" id="confirmPassword" name="confirm_password" required>
                            </div>
                            
                            <button type="submit" class="save-btn" name="update_password">Update Password</button>
                        </form>
                        <?php
                        break;
                        
                    case 'orders':
                        if (isset($data['viewing_details']) && $data['viewing_details']) {
                            // Display single order details
                            $order = $data['order_details'];
                            if ($order) {
                                ?>
                                <div class="order-detail-header">
                                    <h4 class="content-title">Order Details #<?php echo $order['id']; ?></h4>
                                    <a href="index.php?page=profile&section=orders" class="back-to-orders">
                                        <i class="fas fa-arrow-left"></i> Back to Orders
                                    </a>
                                </div>
                                
                                <div class="order-status-bar">
                                    <div class="order-status-item <?php echo in_array($order['status'], ['pending', 'processing', 'shipped', 'delivered']) ? 'active' : ''; ?>">
                                        <div class="status-icon"><i class="fas fa-clipboard-check"></i></div>
                                        <div class="status-text">Pending</div>
                                    </div>
                                    <div class="order-status-item <?php echo in_array($order['status'], ['processing', 'shipped', 'delivered']) ? 'active' : ''; ?>">
                                        <div class="status-icon"><i class="fas fa-box-open"></i></div>
                                        <div class="status-text">Processing</div>
                                    </div>
                                    <div class="order-status-item <?php echo in_array($order['status'], ['shipped', 'delivered']) ? 'active' : ''; ?>">
                                        <div class="status-icon"><i class="fas fa-shipping-fast"></i></div>
                                        <div class="status-text">Shipped</div>
                                    </div>
                                    <div class="order-status-item <?php echo $order['status'] == 'delivered' ? 'active' : ''; ?>">
                                        <div class="status-icon"><i class="fas fa-home"></i></div>
                                        <div class="status-text">Delivered</div>
                                    </div>
                                </div>
                                
                                <div class="order-details-grid">
                                    <div class="order-info-card">
                                        <h5>Order Information</h5>
                                        <div class="info-row">
                                            <span class="info-label">Order ID:</span>
                                            <span class="info-value">#<?php echo $order['id']; ?></span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">Date:</span>
                                            <span class="info-value"><?php echo date('d/m/Y H:i', strtotime($order['created_at'])); ?></span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">Status:</span>
                                            <span class="info-value status-badge status-<?php echo $order['status']; ?>">
                                                <?php echo ucfirst($order['status']); ?>
                                            </span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">Total:</span>
                                            <span class="info-value"><?php echo number_format($order['total'], 0, ',', '.'); ?>₫</span>
                                        </div>
                                    </div>
                                    
                                    <div class="shipping-info-card">
                                        <h5>Shipping Address</h5>
                                        <div class="address-info">
                                            <div class="recipient-name"><?php echo htmlspecialchars($order['recipient_name']); ?></div>
                                            <div><?php echo htmlspecialchars($order['phone']); ?></div>
                                            <div>
                                                <?php echo htmlspecialchars($order['street_address']); ?>, 
                                                <?php echo htmlspecialchars($order['city']); ?>
                                                <?php if (!empty($order['state'])): ?>, <?php echo htmlspecialchars($order['state']); ?><?php endif; ?>
                                            </div>
                                            <div>
                                                <?php if (!empty($order['postal_code'])): ?><?php echo htmlspecialchars($order['postal_code']); ?>, <?php endif; ?>
                                                <?php echo htmlspecialchars($order['country']); ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="order-items-table">
                                    <h5>Order Items</h5>
                                    <div class="table-responsive">
                                        <table class="order-items">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>SKU</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php foreach ($order['items'] as $item): ?>
                                                <tr>
                                                    <td class="product-cell">
                                                        <img src="<?php echo $item['image_thumbnail'] ?? 'images/product-image.png'; ?>" alt="" class="product-thumbnail">
                                                        <div class="product-info">
                                                            <div class="product-name"><?php echo htmlspecialchars($item['name']); ?></div>
                                                        </div>
                                                    </td>
                                                    <td><?php echo htmlspecialchars($item['sku']); ?></td>
                                                    <td><?php echo number_format($item['price'], 0, ',', '.'); ?>₫</td>
                                                    <td><?php echo $item['quantity']; ?></td>
                                                    <td><?php echo number_format($item['price'] * $item['quantity'], 0, ',', '.'); ?>₫</td>
                                                </tr>
                                                <?php endforeach; ?>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="4" class="text-right">Total:</td>
                                                    <td class="order-total"><?php echo number_format($order['total'], 0, ',', '.'); ?>₫</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                
                                <?php 
                            } else {
                                echo '<div class="alert alert-warning">Order not found.</div>';
                            }
                        } else {
                            // Display order history list
                            echo '<h4 class="content-title">My Orders</h4>';
                            
                            if (isset($data['orders']) && !empty($data['orders'])) {
                                ?>
                                <div class="orders-table-container">
                                    <table class="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Ship To</th>
                                                <th>Total</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($data['orders'] as $order): ?>
                                            <tr>
                                                <td class="order-id">#<?php echo $order['id']; ?></td>
                                                <td><?php echo date('d/m/Y H:i:s', strtotime($order['created_at'])); ?></td>

                                                <td>
                                                    <span class="status-badge status-<?php echo $order['status']; ?>">
                                                        <?php echo ucfirst($order['status']); ?>
                                                    </span>
                                                </td>
                                                <td class="ship-to"><?php echo htmlspecialchars($order['recipient_name']); ?></td>
                                                <td class="order-total"><?php echo number_format($order['total'], 0, ',', '.'); ?>₫</td>
                                                <td>
                                                    <a href="index.php?page=profile&section=orders&order_id=<?php echo $order['id']; ?>" class="view-order-btn">
                                                        <i class="fas fa-eye"></i> View
                                                    </a>
                                                </td>
                                            </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                                <?php
                            } else {
                                echo '<div class="empty-state">';
                                echo '<i class="fas fa-shopping-bag empty-icon"></i>';
                                echo '<p>You haven\'t placed any orders yet.</p>';
                                echo '<a href="index.php?page=category" class="btn btn-primary">Start Shopping</a>';
                                echo '</div>';
                            }
                        }
                        break;
                        
                    case 'address':
                        echo '<h4 class="content-title">My Addresses</h4>';
                        
                        // Check if addresses exist in data passed from controller
                        if (isset($data['addresses']) && !empty($data['addresses'])) {
                            ?>
                            <div class="address-list">
                                <?php foreach ($data['addresses'] as $address): ?>
                                <div class="address-card <?php echo $address['is_default'] ? 'default-address' : ''; ?>">
                                    <?php if($address['is_default']): ?>
                                    <span class="default-badge">Default</span>
                                    <?php endif; ?>
                                    
                                    <div class="address-info">
                                        <h5><?php echo htmlspecialchars($address['recipient_name']); ?></h5>
                                        <p><?php echo htmlspecialchars($address['street_address']); ?></p>
                                        <p>
                                            <?php echo htmlspecialchars($address['city']); ?>, 
                                            <?php echo htmlspecialchars($address['state']); ?>, 
                                            <?php echo htmlspecialchars($address['postal_code']); ?>
                                        </p>
                                        <p><?php echo htmlspecialchars($address['country']); ?></p>
                                        <p>Phone: <?php echo htmlspecialchars($address['phone']); ?></p>
                                    </div>
                                    
                                    <div class="address-actions">
                                        <a href="index.php?page=controller/address&action=edit&id=<?php echo $address['id']; ?>" class="edit-address-btn">
                                            <i class="fas fa-edit"></i> Edit
                                        </a>
                                        <?php if(!$address['is_default']): ?>
                                        <a href="index.php?page=controller/address&action=set_default&id=<?php echo $address['id']; ?>" class="make-default-btn">
                                            Set as Default
                                        </a>
                                        <a href="index.php?page=controller/address&action=delete&id=<?php echo $address['id']; ?>" class="delete-address-btn"
                                           onclick="return confirm('Are you sure you want to delete this address?');">
                                            <i class="fas fa-trash"></i> Delete
                                        </a>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            </div>
                            <?php
                        } else {
                            echo '<div class="empty-state">';
                            echo '<i class="fas fa-map-marker-alt empty-icon"></i>';
                            echo '<p>You haven\'t added any addresses yet.</p>';
                            echo '</div>';
                        }
                        ?>
                        
                        <div class="add-new-section">
                            <h5>Add New Address</h5>
                            <form action="index.php?page=controller/address&action=add&redirect=profile&section=address" method="post" class="address-form">
                                <input type="hidden" name="non_ajax" value="1">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="recipientName">Full Name *</label>
                                        <input type="text" class="form-control" id="recipientName" name="recipient_name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">Phone Number *</label>
                                        <input type="text" class="form-control" id="phone" name="phone" required>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="streetAddress">Street Address *</label>
                                    <input type="text" class="form-control" id="streetAddress" name="street_address" required>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="city">City *</label>
                                        <input type="text" class="form-control" id="city" name="city" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="state">State/Province *</label>
                                        <input type="text" class="form-control" id="state" name="state" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="postalCode">Postal Code *</label>
                                        <input type="text" class="form-control" id="postalCode" name="postal_code" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="country">Country *</label>
                                        <input type="text" class="form-control" id="country" name="country" required>
                                    </div>
                                </div>
                                
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="isDefault" name="is_default">
                                    <label class="form-check-label" for="isDefault">Set as default address</label>
                                </div>
                                
                                <button type="submit" class="save-btn">Add Address</button>
                            </form>
                        </div>
                        <?php
                        break;
                          case 'wishlist':
                        echo '<h4 class="content-title">My Wishlist</h4>';

                        // Check if wishlist items exist in data passed from controller
                        if (isset($data['wishlist_items']) && !empty($data['wishlist_items'])) {
                            ?>
                            <div class="wishlist-items">
                                <?php foreach ($data['wishlist_items'] as $item): ?>
                                <div class="wishlist-item">
                                    <div class="wishlist-item-image">
                                        <img src="<?php echo !empty($item['main_image']) ? $item['main_image'] : '../public/images/product-image.png'; ?>" alt="<?php echo htmlspecialchars($item['name']); ?>">
                                    </div>
                                    <div class="wishlist-item-info">
                                        <h5 class="wishlist-item-title">
                                            <a href="index.php?page=view/product&id=<?php echo $item['id']; ?>">
                                                <?php echo htmlspecialchars($item['name']); ?>
                                            </a>
                                        </h5>
                                        <div class="wishlist-item-price">
                                            <?php if (isset($item['has_discount']) && $item['has_discount']): ?>
                                                <span class="discounted-price">
                                                    <?php if ($item['min_price'] == $item['max_price']): ?>
                                                        $<?php echo number_format($item['min_price'], 2); ?>
                                                    <?php else: ?>
                                                        $<?php echo number_format($item['min_price'], 2); ?> - $<?php echo number_format($item['max_price'], 2); ?>
                                                    <?php endif; ?>
                                                </span>
                                                <span class="original-price">
                                                    <?php if ($item['original_min_price'] == $item['original_max_price']): ?>
                                                        $<?php echo number_format($item['original_min_price'], 2); ?>
                                                    <?php else: ?>
                                                        $<?php echo number_format($item['original_min_price'], 2); ?> - $<?php echo number_format($item['original_max_price'], 2); ?>
                                                    <?php endif; ?>
                                                </span>
                                                <span class="discount-badge">-<?php echo $item['discount_percent']; ?>%</span>
                                            <?php else: ?>
                                                <?php if ($item['min_price'] == $item['max_price']): ?>
                                                    $<?php echo number_format($item['min_price'], 2); ?>
                                                <?php else: ?>
                                                    $<?php echo number_format($item['min_price'], 2); ?> - $<?php echo number_format($item['max_price'], 2); ?>
                                                <?php endif; ?>
                                            <?php endif; ?>
                                        </div>
                                        <div class="wishlist-item-date">
                                            Added: <?php echo date('M d, Y', strtotime($item['added_at'])); ?>
                                        </div>
                                    </div>
                                    <div class="wishlist-item-actions">
                                        <a href="index.php?page=controller/cart&action=add&product_id=<?php echo $item['id']; ?>" class="add-to-cart-btn">
                                            <i class="fas fa-shopping-cart"></i> Add to Cart
                                        </a>
                                        <a href="index.php?page=controller/wishlist&action=remove&product_id=<?php echo $item['id']; ?>" class="remove-from-wishlist-btn" 
                                           onclick="return confirm('Are you sure you want to remove this item from your wishlist?');">
                                            <i class="fas fa-trash"></i> Remove
                                        </a>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            </div>
                            <?php
                        } else {
                            echo '<div class="empty-state">';
                            echo '<i class="fas fa-heart empty-icon"></i>';
                            echo '<p>Your wishlist is empty.</p>';
                            echo '<a href="index.php?page=view/category" class="shop-now-btn">Start Shopping</a>';
                            echo '</div>';
                        }
                        break;
                        
                    default:
                        echo '<h4 class="content-title">Account Info</h4>';
                        echo '<p>Invalid section requested.</p>';
                }
                ?>
            </div>
        </div>
    </div>
</div>

<?php
// Include profile wishlist script if on wishlist section
if (isset($_GET['section']) && $_GET['section'] === 'wishlist') {
    echo '<script src="js/profile-wishlist.js"></script>';
}

// Include footer
include_once 'footer.php';
?>
