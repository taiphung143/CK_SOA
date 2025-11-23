const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Apply authentication to all routes
router.use(authenticateToken);

// Specific routes MUST come before parameterized routes
router.get('/stats', isAdmin, orderController.getStats);
router.get('/revenue', isAdmin, orderController.getRevenue);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id/payment-status', orderController.updatePaymentStatus);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
