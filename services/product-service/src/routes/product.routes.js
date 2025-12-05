const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/stats', productController.getStats);
router.get('/sku/:sku_id/stock', productController.checkStock);
router.get('/sku/:sku_id', productController.getSKU);
router.get('/:id(\\d+)', productController.getProduct); // Only match numeric IDs

// Stock management routes
router.post('/stock/reserve', productController.reserveStock);
router.post('/stock/release', productController.releaseStock);
router.post('/stock/confirm', productController.confirmStock);

// Admin routes (authentication should be handled by API Gateway)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/sku/:sku_id/stock', productController.updateStock);

module.exports = router;
