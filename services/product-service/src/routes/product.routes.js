const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/stats', productController.getStats);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/sku/:sku_id/stock', productController.checkStock);
router.get('/:id(\\d+)', productController.getProduct); // Only match numeric IDs

// Admin routes (authentication should be handled by API Gateway)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/sku/:sku_id/stock', productController.updateStock);

module.exports = router;
