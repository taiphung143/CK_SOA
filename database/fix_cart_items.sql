-- Fix invalid cart_item rows where product_id = 0 or sku_id IS NULL
-- Run this script against the cart_db database in your MySQL container

-- Step 1: Identify problematic rows (dry run)
SELECT id, cart_id, product_id, sku_id, quantity, price
FROM cart_item
WHERE product_id = 0 OR sku_id IS NULL;

-- Step 2: Since product_id is NOT NULL, delete rows with product_id = 0
DELETE FROM cart_item WHERE product_id = 0;

-- Step 3: Optionally, delete rows where sku_id IS NULL (if you want to remove them entirely)
-- Uncomment the line below if you prefer to delete instead of keeping
-- DELETE FROM cart_item WHERE sku_id IS NULL;

-- Step 4: Verify changes
SELECT id, cart_id, product_id, sku_id, quantity, price
FROM cart_item
WHERE product_id IS NULL OR sku_id IS NULL;

-- After running, restart cart-service if needed, then test GET /api/cart again