<?php
require_once 'header.php';

require_once(__DIR__ . '/../model/product.php');

$pdo = connectPDO();
$productModel = new ProductModel($pdo);

$id = $_GET['id'] ?? '';
$curentProduct = $productModel->getProductById($id);
$productName = $curentProduct['name'] ?? 'Product';
$productDescription = $curentProduct['description'] ?? 'Product Description';
$productDescription2 = $curentProduct['description_2'] ?? 'Product Description 2';
$productCategoryName = $curentProduct['category_name'] ?? 'Category';
$productCategoryId = $curentProduct['category_id'] ?? 0;
$productSubCategory = $curentProduct['subcategory_name'] ?? 'Sub Category';
$productImage = $curentProduct['image_thumbnail'] ?? 'images/cart/prod26.png';
$productSubCategoryId = $curentProduct['sub_category_id'] ?? 0;
$productSKU = $productModel->getProductSkus($id);
$productBrandName = $productModel->getProductBrand($id);
$productPriceMinMax = $productModel->getProductPrice($id);


// Add current product to recently viewed if user is logged in
if (isset($_SESSION['user']['id'])) {
    $productModel->addRecentlyViewed($_SESSION['user']['id'], $id);
    // Get recently viewed products
    $recentlyViewed = $productModel->getRecentlyViewed($_SESSION['user']['id'], 3);
} else {
    $recentlyViewed = [];
}

$productSkus = $productModel->getSkusByProductId($id);

// Loop through all SKUs and get their attributes
$skuAttributesList = [];
$groupedAttributes = [];

foreach ($productSkus as $sku) {
    $sku_id = $sku['id'];
    $skuAttributes = $productModel->getSkuAttributes($sku_id);

    $skuAttributesList[] = [
        'sku_id' => $sku_id,
        'price' => $sku['price'],
        'stock' => $sku['stock'],
        'attributes' => $skuAttributes
    ];

    // Group attributes by type

    foreach ($skuAttributes as $attr) {
        $type = ucfirst($attr['type']); // Capitalize first letter
        $groupedAttributes[$type][] = $attr['value'];
    }

}


?>
<div class="single-product">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="index.php">Home</a>
            <span>/</span>
            <a href="index.php?page=category&id=<?php echo $productCategoryId?>"><?php echo $productCategoryName?></a>
            <span>/</span>
            <a href="index.php?page=category&id=<?php echo $productCategoryId?>&sub_id=<?php echo $productSubCategoryId?>"><?php echo $productSubCategory?></a>
            <span>/</span>
            <span class="current"><?php echo $productName?></span>
        </div>

<!-- Product Detail Section -->
<section class="main-section">
    <div class="container">
        <div class="product-detail">
            <!-- Product Images -->
            <div class="img-slider">
                <div class="swiper-wrapper">
                    <div class="swiper-slide active">
                        <img src="<?php echo $productImage?>" alt="Product Image">
                    </div>
                </div>
                <div class="small new">new</div>
                <div class="icon-favorites">
                    <i class="fas fa-heart"></i>
                </div>
            </div>

            <!-- Color & Memory Selection -->
        <div class="color-content">
        <?php if (!empty($groupedAttributes['Color'])): ?>
        <div class="color-selection">
            <strong>Available Options: </strong>

            <div class="color-options">
                <div class="color-options grid-options">
                    <?php foreach ($skuAttributesList as $index => $sku): ?>
                        <?php
                            $attrText = array_map(fn($attr) => $attr['value'], $sku['attributes']);
                            $variantLabel = implode(' ', $attrText);
                        ?>
                        <?php 
                            // Get discount for this product
                            $discount = $productModel->getProductDiscount($id); 
                            file_put_contents('log.txt', "Product ID: $id, Discount: " . json_encode($discount) . "\n", FILE_APPEND);
                            $hasDiscount = !empty($discount);
                            $discountedPrice = $hasDiscount ? $productModel->calculateDiscountedPrice($sku['price'], $discount['discount_percent']) : $sku['price'];
                        ?>
                        <label class="color-option <?= $index === 0 ? 'selected' : '' ?>">
                            <div class="info">
                                <span><?= htmlspecialchars($variantLabel) ?></span>
                                <?php if ($hasDiscount): ?>
                                    <strong class="discounted-price">$<?= number_format($discountedPrice, 2) ?></strong>
                                    <span class="original-price">$<?= number_format($sku['price'], 2) ?></span>
                                <?php else: ?>
                                    <strong>$<?= number_format($sku['price'], 2) ?></strong>
                                <?php endif; ?>
                            </div>
                        </label>
                    <?php endforeach; ?>
                </div>

            </div>
        </div>
        <?php endif; ?>


        </div>
              <!-- Product Payment Info -->
            <div class="payment-card">
                <div class="total-price">
                    <small>Total Price:</small>
                    <h5 id="total-price-display">
                    <?php 
                    // Get the price of the first SKU by default
                    $productPrice = !empty($skuAttributesList) ? (float)$skuAttributesList[0]['price'] : 0.0; 
                    ?>
                    <strong>$<?= number_format($productPrice, 2) ?></strong></h5>
                    <input type="hidden" id="selected-sku-price" value="<?= $productPrice ?>">
                    <input type="hidden" id="selected-sku-id" value="<?= !empty($skuAttributesList) ? $skuAttributesList[0]['sku_id'] : '' ?>">
                </div>
                
                <div class="product-tags">
                    <span class="tag free-shipping">free shipping</span>
                    <span class="tag free-gift">free gift</span>
                </div>
                
                <div class="product-stock" id="product-stock-info">
                    <?php if (!empty($skuAttributesList) && $skuAttributesList[0]['stock'] > 0): ?>
                    <i class="fas fa-check-circle"></i>
                    <span>In stock: <?= $skuAttributesList[0]['stock'] ?> items</span>
                    <?php else: ?>
                    <i class="fas fa-times-circle"></i>
                    <span>Out of stock</span>
                    <?php endif; ?>
                </div>
                
                <div class="product-shipping">
                    <i class="fas fa-shipping-fast"></i>
                    <span>Ships from Vietnam</span>
                </div>                <div class="quantity-selector">
                    <span class="qt-minus"><i class="fas fa-minus"></i></span>
                    <input type="text" id="product-quantity" value="1" readonly>
                    <span class="qt-plus"><i class="fas fa-plus"></i></span>
                </div>
                
                <a href="#" class="btn-add-cart <?= (!empty($skuAttributesList) && $skuAttributesList[0]['stock'] <= 0) ? 'disabled' : '' ?>" 
                   id="add-to-cart" 
                   <?= (!empty($skuAttributesList) && $skuAttributesList[0]['stock'] <= 0) ? 'disabled' : '' ?>>
                    Add To Cart
                </a>
                <!-- <a href="#" class="btn-buy-paypal <?= (!empty($skuAttributesList) && $skuAttributesList[0]['stock'] <= 0) ? 'disabled' : '' ?>"
                   <?= (!empty($skuAttributesList) && $skuAttributesList[0]['stock'] <= 0) ? 'disabled' : '' ?>>
                    <span>buy with</span>
                    <img src="images/vnpay.png" alt="VNPAY">
                </a> -->
            </div>
        </div>
        
        <!-- Product Info -->
        <div class="product-info">
                
                <div>
                <h4 class="product-title"><?php echo $productName?></h4>
                <h3 class="product-price">
                    <?php if (isset($productPriceMinMax['has_discount']) && $productPriceMinMax['has_discount']): ?>
                        <span class="discounted-price">
                            $<?= number_format($productPriceMinMax['min_price'], 2) ?>
                            -
                            $<?= number_format($productPriceMinMax['max_price'], 2) ?>
                        </span>
                        <span class="original-price">
                            $<?= number_format($productPriceMinMax['original_min_price'], 2) ?>
                            -
                            $<?= number_format($productPriceMinMax['original_max_price'], 2) ?>
                        </span>
                        <span class="discount-badge">-<?= $productPriceMinMax['discount_percent'] ?>%</span>
                    <?php else: ?>
                        $<?= number_format($productPriceMinMax['min_price'], 2) ?>
                        -
                        $<?= number_format($productPriceMinMax['max_price'], 2) ?>
                    <?php endif; ?>
                </h3>

                </div>
                <div>
                  <div class="product-meta">
                    <div class="meta-item">
                        <strong>SKU: </strong>
                        <span id="product-sku-display"><?= !empty($skuAttributesList) ? htmlspecialchars($productModel->getSkuCode($skuAttributesList[0]['sku_id']) ?? 'SKU-'.$skuAttributesList[0]['sku_id']) : $productSKU ?></span>
                    </div>
                    <div class="meta-item">
                        <strong>Category: </strong>
                        <span><?php echo $productCategoryName?> - <?php echo $productSubCategory?></span>
                    </div>
                    <div class="meta-item">
                        <strong>Brand: </strong>
                        <span class="brand"><?php echo $productBrandName?></span>
                    </div>
                </div>
                </div>
                <div>

                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span class="reviews">(5) stars</span>
                </div>
                

                
                
                  <div class="action-links">
                    <a href="#" class="wishlist-link" id="wishlist-toggle" data-product-id="<?php echo $id; ?>">
                        <i class="fas fa-heart <?php echo (isset($_SESSION['user']['id']) && $productModel->isInWishlist($_SESSION['user']['id'], $id)) ? 'active' : ''; ?>"></i>
                        <span id="wishlist-text"><?php echo (isset($_SESSION['user']['id']) && $productModel->isInWishlist($_SESSION['user']['id'], $id)) ? 'Remove from Wishlist' : 'Add to Wishlist'; ?></span>
                    </a>
                    <a href="#" class="compare-link">
                        <i class="fas fa-exchange-alt"></i>
                        <span>Compare</span>
                    </a>
                </div>
                </div>
                
                </div>                
                
            </div>

</section>

<!-- Product Tabs Section -->
<section class="main-section">
    <div class="container">
        <div class="product-tabs">            
            <div class="tab-navigation">
                <button class="tab-btn active">description</button>
                <button class="tab-btn">reviews (5)</button>
                <button class="tab-btn">specifications</button>
            </div>
            
            <?php
            // Split the description by new lines (you can tweak this depending on formatting)
            $paragraphs = preg_split("/\n\s*\n|(\r?\n){2,}/", trim($productDescription));

            // Prepare output with image after the 2nd paragraph
            ?>

            <div class="tab-content active">
                <?php
                foreach ($paragraphs as $index => $para):
                    if ($index === 2): // After 2 full paragraphs (0 and 1)
                ?>
                    <div class="product-image">
                        <img src="<?= $productImage ?>" alt="Product Detail" class="detail-img">
                    </div>
                <?php
                    endif;
                ?>
                    <p class="product-description"><?= nl2br(trim($para)) ?></p>
                <?php endforeach; ?>
            </div>


            
            <!-- Reviews Tab Content -->
            <div class="tab-content">
                <div class="reviews-container">
                    <div class="review-summary">
                        <h4>Customer Reviews</h4>
                        <div class="overall-rating">
                            <div class="rating-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half"></i>
                            </div>
                            <span class="rating-value">4.5 out of 5</span>
                            <span class="reviews-count">Based on 5 reviews</span>
                        </div>
                        <a href="#" class="write-review-btn">Write a Review</a>
                    </div>
                    
                    <div class="review-list">
                        <div class="review-item">
                            <div class="reviewer-info">
                                <strong>John D.</strong>
                                <span class="review-date">March 15, 2025</span>
                            </div>
                            <div class="rating-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <h5 class="review-title">Great product, highly recommend!</h5>
                            <p class="review-content">
                                This product exceeded my expectations. The quality is excellent and it works perfectly for my needs.
                            </p>
                        </div>
                        
                        <div class="review-item">
                            <div class="reviewer-info">
                                <strong>Sarah M.</strong>
                                <span class="review-date">March 10, 2025</span>
                            </div>
                            <div class="rating-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                            </div>
                            <h5 class="review-title">Good quality but a bit expensive</h5>
                            <p class="review-content">
                                The product quality is good but I think it's slightly overpriced for what you get.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Specifications Tab Content -->
            <div class="tab-content">
                <div class="specifications">
                    <?php
                    $lines = explode("\n", $productDescription2);
                    $currentSection = '';
                    ?>

                    <?php foreach ($lines as $line): ?>
                        <?php
                        $line = trim($line);
                        // If the line ends with a colon, it's a new section
                        if (substr($line, -1) === ':') {
                            // Close previous section if needed
                            if (!empty($currentSection)) {
                                echo '</ul>';
                            }
                            // Start new section
                            $currentSection = rtrim($line, ':');
                            echo "<h4><strong>" . htmlspecialchars($currentSection) . "</strong></h4>";
                            echo '<ul class="product-features">';
                        } elseif (!empty($line)) {
                            // Print each line as a list item
                            echo "<li><span class=\"bullet\"></span> " . htmlspecialchars($line) . "</li>";
                        }
                        ?>
                    <?php endforeach; ?>

                    <?php
                    // Close the last <ul> if a section was opened
                    if (!empty($currentSection)) {
                        echo '</ul>';
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Recently Viewed Products -->
<?php if (!empty($recentlyViewed) && isset($_SESSION['user']['id'])): ?>
<section class="main-section">
    <div class="container">
        <div class="recently-viewed">
            <div class="section-header">
                <h6 class="section-title">your recently viewed</h6>
                <a href="#" class="view-all">View All <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="arrows">
                <button class="next-button">next</button>
                <button class="prev-button disabled">prev</button>
            </div>
            
            <div class="products-slider">
                <?php foreach ($recentlyViewed as $recentProduct): ?>
                <div class="product-card">
                    <div class="product-image">
                        <img src="<?= !empty($recentProduct['image_thumbnail']) ? htmlspecialchars($recentProduct['image_thumbnail']) : 'images/cart/prod26.png' ?>" 
                             alt="<?= htmlspecialchars($recentProduct['name']) ?>">
                        <?php if (isset($recentProduct['rating']) && $recentProduct['rating'] > 0): ?>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                        </div>
                        <?php endif; ?>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name"><?= htmlspecialchars($recentProduct['name']) ?></h3>
                        <h6 class="product-price">
                            <?php if (isset($recentProduct['has_discount']) && $recentProduct['has_discount']): ?>
                                <span class="discounted-price">
                                    <?php if (isset($recentProduct['min_price']) && isset($recentProduct['max_price'])): ?>
                                        <?= $recentProduct['min_price'] == $recentProduct['max_price'] 
                                            ? '$' . number_format($recentProduct['min_price'], 2) 
                                            : '$' . number_format($recentProduct['min_price'], 2) . ' - $' . number_format($recentProduct['max_price'], 2) ?>
                                    <?php else: ?>
                                        $<?= number_format($recentProduct['price'] ?? 0, 2) ?>
                                    <?php endif; ?>
                                </span>
                                <span class="original-price">
                                    <?php if (isset($recentProduct['original_min_price']) && isset($recentProduct['original_max_price'])): ?>
                                        <?= $recentProduct['original_min_price'] == $recentProduct['original_max_price'] 
                                            ? '$' . number_format($recentProduct['original_min_price'], 2) 
                                            : '$' . number_format($recentProduct['original_min_price'], 2) . ' - $' . number_format($recentProduct['original_max_price'], 2) ?>
                                    <?php else: ?>
                                        $<?= number_format($recentProduct['original_price'] ?? 0, 2) ?>
                                    <?php endif; ?>
                                </span>
                                <span class="discount-badge">-<?= $recentProduct['discount_percent'] ?>%</span>
                            <?php else: ?>
                                <?php if (isset($recentProduct['min_price']) && isset($recentProduct['max_price'])): ?>
                                    <?= $recentProduct['min_price'] == $recentProduct['max_price'] 
                                        ? '$' . number_format($recentProduct['min_price'], 2) 
                                        : '$' . number_format($recentProduct['min_price'], 2) . ' - $' . number_format($recentProduct['max_price'], 2) ?>
                                <?php else: ?>
                                    $<?= number_format($recentProduct['price'] ?? 0, 2) ?>
                                <?php endif; ?>
                            <?php endif; ?>
                        </h6>
                        <?php if (isset($recentProduct['is_new']) && $recentProduct['is_new']): ?>
                        <span class="badge new">new</span>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Related Products -->
<?php $relatedProducts = $productModel->getAllProductsBySubCategories(4, $productCategoryId, $productSubCategoryId); 
// file_put_contents(__DIR__ . 'logProduct.txt', print_r($relatedProducts, $id, $productSubCategoryId, true), FILE_APPEND);
?>

<section class="main-section">
    <div class="container">
        <div class="related-products">
            <h6 class="section-title">related products</h6>
            
            <div class="products-slider">
                <?php if (!empty($relatedProducts)): ?>
                    <?php foreach ($relatedProducts as $relatedProduct): ?>
                    <div class="product-card">
                        <div class="product-image">
                            <a href="index.php?page=view/product&id=<?php echo $relatedProduct['id']; ?>">
                                <img src="<?php echo !empty($relatedProduct['image_thumbnail']) ? $relatedProduct['image_thumbnail'] : 'images/cart/product-image.png'; ?>" 
                                     alt="<?php echo htmlspecialchars($relatedProduct['name']); ?>">
                            </a>
                            
                            <?php if (isset($relatedProduct['rating']) && $relatedProduct['rating'] > 0): ?>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>(<?php echo $relatedProduct['rating_count'] ?? 0; ?>)</span>
                            </div>
                            <?php endif; ?>
                            
                            <?php if (isset($relatedProduct['discount']) && $relatedProduct['discount'] > 0): ?>
                            <div class="discount-badge">
                                <span>save</span>
                                <h6>$<?php echo number_format($relatedProduct['discount'], 2); ?></h6>
                            </div>
                            <?php endif; ?>
                            
                            <?php if (isset($relatedProduct['is_new']) && $relatedProduct['is_new']): ?>
                            <span class="badge new">new</span>
                            <?php endif; ?>
                            
                            <button class="wishlist-btn" data-product-id="<?php echo $relatedProduct['id']; ?>">
                                <i class="fas fa-heart <?php echo (isset($_SESSION['user']['id']) && $productModel->isInWishlist($_SESSION['user']['id'], $relatedProduct['id'])) ? 'active' : ''; ?>"></i>
                            </button>
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">
                                <a href="index.php?page=view/product&id=<?php echo $relatedProduct['id']; ?>">
                                    <?php echo htmlspecialchars($relatedProduct['name']); ?>
                                </a>
                            </h3>
                            
                            <?php if (isset($relatedProduct['has_discount']) && $relatedProduct['has_discount']): ?>
                            <h5 class="product-price sale">
                                <span class="discounted-price">
                                    <?php if (isset($relatedProduct['min_price']) && isset($relatedProduct['max_price']) && $relatedProduct['min_price'] != $relatedProduct['max_price']): ?>
                                        $<?php echo number_format($relatedProduct['min_price'], 2); ?> - $<?php echo number_format($relatedProduct['max_price'], 2); ?>
                                    <?php else: ?>
                                        $<?php echo number_format($relatedProduct['min_price'] ?? 0, 2); ?>
                                    <?php endif; ?>
                                </span>
                                <span class="original-price">
                                    <?php if (isset($relatedProduct['original_min_price']) && isset($relatedProduct['original_max_price']) && $relatedProduct['original_min_price'] != $relatedProduct['original_max_price']): ?>
                                        $<?php echo number_format($relatedProduct['original_min_price'], 2); ?> - $<?php echo number_format($relatedProduct['original_max_price'], 2); ?>
                                    <?php else: ?>
                                        $<?php echo number_format($relatedProduct['original_min_price'] ?? 0, 2); ?>
                                    <?php endif; ?>
                                </span>
                                <span class="discount-badge">-<?php echo $relatedProduct['discount_percent']; ?>%</span>
                            </h5>
                            <?php else: ?>
                                <h5 class="product-price">
                                    <?php if (isset($relatedProduct['min_price']) && isset($relatedProduct['max_price']) && $relatedProduct['min_price'] != $relatedProduct['max_price']): ?>
                                        $<?php echo number_format($relatedProduct['min_price'], 2); ?> - $<?php echo number_format($relatedProduct['max_price'], 2); ?>
                                    <?php else: ?>
                                        $<?php echo number_format($relatedProduct['min_price'] ?? 0, 2); ?>
                                    <?php endif; ?>
                                </h5>
                            <?php endif; ?>
                            
                            <div class="product-tags">
                                <?php if (isset($relatedProduct['free_shipping']) && $relatedProduct['free_shipping']): ?>
                                <span class="tag free-shipping">free shipping</span>
                                <?php elseif (isset($relatedProduct['shipping_cost'])): ?>
                                <span class="tag shipping">$<?php echo number_format($relatedProduct['shipping_cost'], 2); ?> Shipping</span>
                                <?php endif; ?>
                                
                                <?php if (isset($relatedProduct['free_gift']) && $relatedProduct['free_gift']): ?>
                                <span class="tag free-gift">free gift</span>
                                <?php endif; ?>
                            </div>
                            
                            <?php if (isset($relatedProduct['stock']) && $relatedProduct['stock'] > 0): ?>
                            <div class="stock">
                                <i class="fas fa-check-circle"></i>
                                <span>In stock</span>
                            </div>
                            <?php else: ?>
                            <div class="out-of-stock">
                                <i class="fas fa-times-circle"></i>
                                <span>Out of stock</span>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="no-related-products">
                        <p>No related products found.</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="slider-navigation">
                <button class="next-button">next</button>
                <button class="prev-button disabled">prev</button>
            </div>
        </div>
    </div>
</section>

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Get all the necessary elements
    const colorOptions = document.querySelectorAll('.color-option');
    const quantityInput = document.getElementById('product-quantity');
    const qtMinus = document.querySelector('.qt-minus');
    const qtPlus = document.querySelector('.qt-plus');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const selectedSkuPriceInput = document.getElementById('selected-sku-price');
    const selectedSkuIdInput = document.getElementById('selected-sku-id');
    const monthlyPriceDisplay = document.getElementById('monthly-price');
    const addToCartButton = document.getElementById('add-to-cart');
      // Store SKU data for easy access
    const skuData = [
        <?php foreach ($skuAttributesList as $index => $sku): 
            // Get the actual SKU code for this variant
            $skuCode = $productModel->getSkuCode($sku['sku_id']) ?? ('SKU-' . $sku['sku_id']);
            // Get discount for this product
            $discount = $productModel->getProductDiscount($id); 
            $hasDiscount = !empty($discount);
            $discountPercent = $hasDiscount ? $discount['discount_percent'] : 0;
            $discountedPrice = $hasDiscount ? $productModel->calculateDiscountedPrice($sku['price'], $discountPercent) : $sku['price'];
        ?>,
        {
            skuId: '<?= $sku['sku_id'] ?>',
            skuCode: '<?= addslashes($skuCode) ?>',
            originalPrice: <?= $sku['price'] ?>,
            price: <?= $discountedPrice ?>,
            stock: <?= $sku['stock'] ?>,
            hasDiscount: <?= $hasDiscount ? 'true' : 'false' ?>,
            discountPercent: <?= $discountPercent ?>
        },
        <?php endforeach; ?>
    ];
      // Function to update the total price and stock info
    function updateTotalPrice() {
        const quantity = parseInt(quantityInput.value);
        const skuPrice = parseFloat(selectedSkuPriceInput.value);
        const totalPrice = quantity * skuPrice;
        
        // Get selected SKU index
        const selectedIndex = Array.from(colorOptions).findIndex(option => option.classList.contains('selected'));
        const currentSku = skuData[selectedIndex];
        
        // Update the total price display
        if (currentSku && currentSku.hasDiscount) {
            const originalTotal = quantity * currentSku.originalPrice;
            totalPriceDisplay.innerHTML = `
                <strong class="discounted-price">$${totalPrice.toFixed(2)}</strong>
                <span class="original-price">$${originalTotal.toFixed(2)}</span>
                <span class="discount-badge">-${currentSku.discountPercent}%</span>
            `;
        } else {
            totalPriceDisplay.innerHTML = `<strong>$${totalPrice.toFixed(2)}</strong>`;
        }
        
        // Update monthly price (affirm)
        if(typeof monthlyPriceDisplay !== 'undefined' && monthlyPriceDisplay) {
            const monthlyPrice = Math.round(totalPrice / 12);
            monthlyPriceDisplay.textContent = `$${monthlyPrice}/m`;
        }
    }
      // Function to update stock information
    function updateStockInfo(index) {
        const stockInfo = document.getElementById('product-stock-info');
        const currentSku = skuData[index];
        
        if (currentSku && stockInfo) {
            if (currentSku.stock > 0) {
                stockInfo.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>In stock: ${currentSku.stock} items</span>
                `;
                
                // Enable add to cart button
                if (addToCartButton) {
                    addToCartButton.classList.remove('disabled');
                    addToCartButton.removeAttribute('disabled');
                }
                
                // Reset quantity if it exceeds current stock
                const currentQuantity = parseInt(quantityInput.value);
                if (currentQuantity > currentSku.stock) {
                    quantityInput.value = currentSku.stock;
                    updateTotalPrice();
                }
            } else {
                stockInfo.innerHTML = `
                    <i class="fas fa-times-circle"></i>
                    <span>Out of stock</span>
                `;
                
                // Disable add to cart button
                if (addToCartButton) {
                    addToCartButton.classList.add('disabled');
                    addToCartButton.setAttribute('disabled', 'disabled');
                }
                
                // Reset quantity to 1 when out of stock
                quantityInput.value = 1;
                updateTotalPrice();
            }
        }
    }
      // Add event listeners to color options
    colorOptions.forEach((option, index) => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
              // Update selected SKU price and ID
            if (skuData[index]) {
                // Use the final price (already includes discount if applicable)
                selectedSkuPriceInput.value = skuData[index].price;
                selectedSkuIdInput.value = skuData[index].skuId;
                
                // Update the total price
                updateTotalPrice();
                
                // Update stock information for this variant
                updateStockInfo(index);
                
                // Update the displayed SKU code in product meta
                const skuDisplay = document.getElementById('product-sku-display');
                if (skuDisplay) {
                    skuDisplay.textContent = skuData[index].skuCode;
                }
            }
        });
    });
      // Add event listeners to quantity buttons
    qtMinus.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
            updateTotalPrice();
        }
    });
    
    qtPlus.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        const selectedIndex = Array.from(colorOptions).findIndex(option => option.classList.contains('selected'));
        const currentSku = skuData[selectedIndex];
        
        if (currentSku && quantity < currentSku.stock) {
            quantityInput.value = quantity + 1;
            updateTotalPrice();
        } else {
            // Show a small notification that max stock is reached
            const stockInfo = document.getElementById('product-stock-info');
            if (stockInfo) {
                stockInfo.classList.add('stock-limit-reached');
                setTimeout(() => {
                    stockInfo.classList.remove('stock-limit-reached');
                }, 1000);
            }
        }
    });      // Add to cart functionality
    addToCartButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if button is disabled before proceeding
        if (this.hasAttribute('disabled') || this.classList.contains('disabled')) {
            console.log('Button is disabled, cannot add to cart');
            // Show out of stock message
            showNotification('Sorry, this product is out of stock', 'error');
            return; // Exit the function early
        }
        
        const selectedSkuId = selectedSkuIdInput.value;
        const quantity = parseInt(quantityInput.value);
        
        // Create form data for submission
        const formData = new FormData();
        formData.append('sku_id', selectedSkuId);
        formData.append('quantity', quantity);
        formData.append('action', 'add');
        
        // Show loading state
        addToCartButton.textContent = 'Adding...';
        addToCartButton.disabled = true;
        
        // Send AJAX request to add item to cart
        fetch('index.php?page=cart&action=add', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                showNotification(data.message || 'Product added to cart!', 'success');
                
                // Update cart count in header if it exists
                if (data.cartCount && document.getElementById('cart-count')) {
                    document.getElementById('cart-count').textContent = data.cartCount;
                    document.getElementById('cart-count').style.display = data.cartCount > 0 ? 'flex' : 'none';
                }
            } else {
                // Show error message
                if (data.redirect) {
                    // Handle redirect for login required
                    if (confirm(data.message + '. Do you want to log in?')) {
                        window.location.href = data.redirect;
                    }
                } else {
                    showNotification(data.message || 'Failed to add product to cart', 'error');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            addToCartButton.textContent = 'Add To Cart';
            addToCartButton.disabled = false;
        });
    });
      // Tab Navigation functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and corresponding content
            this.classList.add('active');
            if (tabContents[index]) {
                tabContents[index].classList.add('active');
            }
        });
    });
    
    // Wishlist functionality
    const wishlistToggle = document.getElementById('wishlist-toggle');
    const wishlistIcon = wishlistToggle ? wishlistToggle.querySelector('i') : null;
    const wishlistText = document.getElementById('wishlist-text');
    
    if (wishlistToggle) {
        wishlistToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.getAttribute('data-product-id');
            const isInWishlist = wishlistIcon.classList.contains('active');
            const action = isInWishlist ? 'remove' : 'add';
              // Send AJAX request
            fetch('index.php?page=wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=${action}&product_id=${productId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Toggle wishlist status
                    if (action === 'add') {
                        wishlistIcon.classList.add('active');
                        wishlistText.textContent = 'Remove from Wishlist';
                        showNotification('Product added to wishlist!');
                    } else {
                        wishlistIcon.classList.remove('active');
                        wishlistText.textContent = 'Add to Wishlist';
                        showNotification('Product removed from wishlist!');
                    }
                } else {
                    // Handle error
                    if (data.message.includes('log in')) {
                        window.location.href = 'index.php?page=login';
                    } else {
                        showNotification(data.message, 'error');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again.', 'error');
            });
        });
    }
    
    // Simple notification function
    function showNotification(message, type = 'success') {
        // Check if notification container exists, create if not
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '1000';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.padding = '12px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.minWidth = '250px';
        notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s forwards';
        
        // Set colors based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
        } else {
            notification.style.backgroundColor = '#F44336';
            notification.style.color = 'white';
        }
        
        notification.textContent = message;
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Add CSS for animations
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
});
</script>

<?php 
require_once 'footer.php';
?>
