const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate, addressSchema } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// GET /api/addresses
router.get('/', addressController.getAddresses);

// GET /api/addresses/:id
router.get('/:id', addressController.getAddress);

// POST /api/addresses
router.post('/', validate(addressSchema), addressController.createAddress);

// PUT /api/addresses/:id
router.put('/:id', addressController.updateAddress);

// DELETE /api/addresses/:id
router.delete('/:id', addressController.deleteAddress);

// PUT /api/addresses/:id/set-default
router.put('/:id/set-default', addressController.setDefaultAddress);

module.exports = router;
