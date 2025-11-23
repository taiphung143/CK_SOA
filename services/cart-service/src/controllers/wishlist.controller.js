const { Wishlist } = require('../models');
const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';

class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];

      const wishlist = await Wishlist.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
      });

      // Fetch product details (simplified)
      // In production, make batch request to product service
      const items = await Promise.all(wishlist.map(async (item) => {
        return item.toJSON();
      }));

      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      next(error);
    }
  }

  async addToWishlist(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { product_id, sku_id } = req.body;

      // Check if already in wishlist
      const existing = await Wishlist.findOne({
        where: { 
          user_id: userId, 
          product_id, 
          sku_id: sku_id || null 
        }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Item already in wishlist'
        });
      }

      const wishlistItem = await Wishlist.create({
        user_id: userId,
        product_id,
        sku_id: sku_id || null
      });

      res.status(201).json({
        success: true,
        message: 'Item added to wishlist',
        data: wishlistItem
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { id } = req.params;

      const wishlistItem = await Wishlist.findOne({
        where: { 
          id, 
          user_id: userId 
        }
      });

      if (!wishlistItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in wishlist'
        });
      }

      await wishlistItem.destroy();

      res.json({
        success: true,
        message: 'Item removed from wishlist'
      });
    } catch (error) {
      next(error);
    }
  }

  async clearWishlist(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];

      await Wishlist.destroy({ where: { user_id: userId } });

      res.json({
        success: true,
        message: 'Wishlist cleared'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WishlistController();
