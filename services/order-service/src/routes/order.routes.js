const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const voucherController = require('../controllers/voucher.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Apply authentication to all routes
// JWT authentication is handled by API Gateway, which extracts userId and sends x-user-id header
// router.use(authenticateToken);

// Specific routes MUST come before parameterized routes
router.get('/stats', isAdmin, (req, res, next) => orderController.getStats(req, res, next));
router.get('/revenue', isAdmin, (req, res, next) => orderController.getRevenue(req, res, next));

router.post('/', (req, res, next) => orderController.createOrder(req, res, next));
router.get('/', (req, res, next) => orderController.getOrders(req, res, next));
router.get('/:id', (req, res, next) => orderController.getOrder(req, res, next));
router.put('/:id/status', (req, res, next) => orderController.updateOrderStatus(req, res, next));
router.put('/:id/payment-status', (req, res, next) => orderController.updatePaymentStatus(req, res, next));
router.put('/:id/cancel', (req, res, next) => orderController.cancelOrder(req, res, next));

// Voucher routes
router.post('/vouchers/validate', (req, res, next) => voucherController.validateVoucher(req, res, next));
router.get('/vouchers', isAdmin, (req, res, next) => voucherController.getVouchers(req, res, next));
router.post('/vouchers', isAdmin, (req, res, next) => voucherController.createVoucher(req, res, next));
router.put('/vouchers/:id', isAdmin, (req, res, next) => voucherController.updateVoucher(req, res, next));
router.delete('/vouchers/:id', isAdmin, (req, res, next) => voucherController.deleteVoucher(req, res, next));

module.exports = router;
