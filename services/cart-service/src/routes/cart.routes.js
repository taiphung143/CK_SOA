const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.put('/items/:item_id', cartController.updateCartItem);
router.delete('/items/:item_id', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);
router.post('/discount', cartController.applyDiscount);

module.exports = router;
