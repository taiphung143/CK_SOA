<?php
// This file should be included in the product.php view
// It handles the display of product attributes and variants

// First, organize attributes by type
$attributesByType = [];
if (isset($attributes) && is_array($attributes)) {
    foreach ($attributes as $attribute) {
        $type = $attribute['type'];
        $value = $attribute['value'];
        
        if (!isset($attributesByType[$type])) {
            $attributesByType[$type] = [];
        }
        
        $attributesByType[$type][] = $value;
    }
}

// Function to get selected SKU based on attribute selection
function findSelectedSku($skus, $selectedAttributes) {
    if (empty($selectedAttributes) || empty($skus)) {
        return null;
    }
    
    foreach ($skus as $sku) {
        $skuAttributes = $sku['attributes'] ?? [];
        $match = true;
        
        // Check if this SKU matches all selected attributes
        foreach ($selectedAttributes as $type => $value) {
            if (!isset($skuAttributes[$type]) || $skuAttributes[$type] !== $value) {
                $match = false;
                break;
            }
        }
        
        if ($match) {
            return $sku;
        }
    }
    
    return null;
}

// Initialize selected attributes from URL parameters if present
$selectedAttributes = [];
foreach ($attributesByType as $type => $values) {
    if (isset($_GET[$type])) {
        $selectedValue = $_GET[$type];
        if (in_array($selectedValue, $values)) {
            $selectedAttributes[$type] = $selectedValue;
        }
    }
}

// Find the selected SKU based on attributes
$selectedSku = null;
if (!empty($selectedAttributes)) {
    $selectedSku = findSelectedSku($skus, $selectedAttributes);
}

// If no SKU is selected yet, use the first one as default
if (!$selectedSku && isset($skus) && count($skus) > 0) {
    $selectedSku = $skus[0];
}
?>

<!-- Display attribute options for selection -->
<?php if (!empty($attributesByType)): ?>
    <div class="product-attributes">
        <?php foreach ($attributesByType as $type => $values): ?>
            <div class="attribute-group">
                <h4 class="attribute-title"><?php echo htmlspecialchars(ucfirst($type)); ?>:</h4>
                <div class="attribute-options" data-attribute-type="<?php echo htmlspecialchars(strtolower($type)); ?>">
                    <?php foreach ($values as $value): ?>
                        <?php 
                        // Check if this attribute option is available based on current selection
                        $tempAttributes = $selectedAttributes;
                        $tempAttributes[$type] = $value;
                        $isAvailable = (findSelectedSku($skus, $tempAttributes) !== null);
                        
                        // Determine if this attribute is selected
                        $isSelected = isset($selectedAttributes[$type]) && $selectedAttributes[$type] === $value;
                        ?>
                        
                        <div class="attribute-option <?php echo $isSelected ? 'selected' : ''; ?> <?php echo !$isAvailable ? 'unavailable' : ''; ?>" 
                             data-type="<?php echo htmlspecialchars(strtolower($type)); ?>" 
                             data-value="<?php echo htmlspecialchars($value); ?>">
                            <?php if (strtolower($type) === 'color'): ?>
                                <span class="color-swatch" style="background-color: <?php echo htmlspecialchars($value); ?>"></span>
                            <?php else: ?>
                                <span class="attribute-value"><?php echo htmlspecialchars($value); ?></span>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<!-- Display selected attribute info -->
<div class="selected-attributes">
    <?php foreach ($attributesByType as $type => $values): ?>
        <div class="selected-attribute">
            <span class="attribute-type"><?php echo htmlspecialchars(ucfirst($type)); ?>:</span>
            <span class="selected-value" id="selected-<?php echo strtolower($type); ?>">
                <?php echo isset($selectedAttributes[$type]) ? htmlspecialchars($selectedAttributes[$type]) : 'Please select'; ?>
            </span>
        </div>
    <?php endforeach; ?>
</div>

<!-- SKU Information -->
<?php if ($selectedSku): ?>
    <div class="product-sku-info">
        <div class="sku-code">
            <strong>SKU:</strong> <?php echo htmlspecialchars($selectedSku['sku']); ?>
        </div>
        <?php if (isset($selectedSku['brand_name']) && $selectedSku['brand_name']): ?>
            <div class="brand-name">
                <strong>Brand:</strong> <?php echo htmlspecialchars($selectedSku['brand_name']); ?>
            </div>
        <?php endif; ?>
        <div class="stock-status <?php echo $selectedSku['stock'] > 0 ? 'in-stock' : 'out-of-stock'; ?>">
            <strong>Availability:</strong> <?php echo $selectedSku['stock'] > 0 ? 'In Stock' : 'Out of Stock'; ?>
            <?php if ($selectedSku['stock'] > 0): ?>
                (<?php echo $selectedSku['stock']; ?> items available)
            <?php endif; ?>
        </div>
    </div>
<?php endif; ?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle attribute selection
    const attributeOptions = document.querySelectorAll('.attribute-option');
    const addToCartBtn = document.getElementById('add-to-cart');
    const buyNowBtn = document.getElementById('buy-now');
    const productPrice = document.getElementById('product-price');
    const stockStatus = document.getElementById('stock-status');
    const productQuantity = document.getElementById('product-quantity');
    
    // Product SKUs data for client-side use
    const skus = <?php echo json_encode($skus ?? []); ?>;
    
    // Currently selected attributes
    let selectedAttributes = <?php echo json_encode($selectedAttributes); ?>;
    
    // Update the UI based on selected attributes
    function updateProductDetails() {
        // Find matching SKU
        const selectedSku = findSelectedSku(skus, selectedAttributes);
        
        if (selectedSku) {
            // Update price
            productPrice.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                .format(selectedSku.price)
                .replace('₫', '') + '₫';
            
            // Update stock status
            if (selectedSku.stock > 0) {
                stockStatus.textContent = 'Còn hàng';
                stockStatus.className = 'in-stock';
                addToCartBtn.disabled = false;
                buyNowBtn.disabled = false;
            } else {
                stockStatus.textContent = 'Hết hàng';
                stockStatus.className = 'out-of-stock';
                addToCartBtn.disabled = true;
                buyNowBtn.disabled = true;
            }
            
            // Update selected values display
            for (const type in selectedAttributes) {
                const display = document.getElementById(`selected-${type.toLowerCase()}`);
                if (display) {
                    display.textContent = selectedAttributes[type];
                }
            }
            
            // Reset quantity
            if (productQuantity) {
                productQuantity.value = "1";
            }
            
            // Update URL to reflect selection without reloading page
            const url = new URL(window.location);
            for (const type in selectedAttributes) {
                url.searchParams.set(type, selectedAttributes[type]);
            }
            window.history.replaceState({}, '', url);
            
            // Store selected SKU ID
            if (addToCartBtn) {
                addToCartBtn.dataset.skuId = selectedSku.id;
            }
            if (buyNowBtn) {
                buyNowBtn.dataset.skuId = selectedSku.id;
            }
        }
    }
    
    // Helper function to find matching SKU
    function findSelectedSku(skus, selectedAttrs) {
        const selectedTypes = Object.keys(selectedAttrs);
        if (selectedTypes.length === 0) return skus[0]; // Default to first SKU if no selection
        
        for (const sku of skus) {
            if (!sku.attributes) continue;
            
            let match = true;
            for (const type of selectedTypes) {
                if (!sku.attributes[type] || sku.attributes[type] !== selectedAttrs[type]) {
                    match = false;
                    break;
                }
            }
            
            if (match) return sku;
        }
        return null;
    }
    
    // Update available attribute options based on current selection
    function updateAvailableOptions() {
        const attributeTypes = <?php echo json_encode(array_keys($attributesByType)); ?>;
        
        attributeTypes.forEach(type => {
            const options = document.querySelectorAll(`.attribute-option[data-type="${type.toLowerCase()}"]`);
            
            options.forEach(option => {
                const value = option.dataset.value;
                
                // Check if this value is available with current selections
                const tempAttrs = {...selectedAttributes};
                tempAttrs[type] = value;
                
                // For each attribute type, try to find a matching SKU
                let validOption = false;
                for (const sku of skus) {
                    if (!sku.attributes) continue;
                    
                    let match = true;
                    for (const [attrType, attrValue] of Object.entries(tempAttrs)) {
                        // Skip checking other attributes of the same type
                        if (attrType === type) continue;
                        
                        if (!sku.attributes[attrType] || sku.attributes[attrType] !== attrValue) {
                            match = false;
                            break;
                        }
                    }
                    
                    // This is a valid combination if sku.attributes[type] === value
                    if (match && sku.attributes[type] === value) {
                        validOption = true;
                        break;
                    }
                }
                
                if (validOption) {
                    option.classList.remove('unavailable');
                } else {
                    option.classList.add('unavailable');
                }
            });
        });
    }
    
    // Handle attribute option click
    attributeOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('unavailable')) return;
            
            const type = this.dataset.type;
            const value = this.dataset.value;
            
            // Update selection
            selectedAttributes[type] = value;
            
            // Update UI
            document.querySelectorAll(`.attribute-option[data-type="${type}"]`).forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Update available options
            updateAvailableOptions();
            
            // Update product details
            updateProductDetails();
        });
    });
    
    // Initialize UI
    updateAvailableOptions();
    updateProductDetails();
});
</script>
