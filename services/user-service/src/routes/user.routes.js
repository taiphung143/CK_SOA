const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const { validate, updateProfileSchema, changePasswordSchema } = require('../middleware/validation');

// Protected routes - require authentication
router.use(authenticateToken);

// GET /api/users/profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

// POST /api/users/change-password
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

// DELETE /api/users/account
router.delete('/account', userController.deleteAccount);

// Admin only routes
router.get('/stats', isAdmin, userController.getStats);
router.get('/', isAdmin, userController.getAllUsers);

module.exports = router;
