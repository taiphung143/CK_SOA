const { Cart, CartItem } = require('../models');
const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';

class CartController {
  async getCart(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];

      let cart = await Cart.findOne({
        where: { user_id: userId },
        include: [{ model: CartItem, as: 'items' }]
      });

      if (!cart) {
        cart = await Cart.create({ user_id: userId });
      }

      // Convert to plain object to avoid circular reference issues
      let cartData = cart.toJSON();

      // Fetch product details from Product Service
      if (cartData.items && cartData.items.length > 0) {
        try {
          const items = await Promise.all(cartData.items.map(async (item) => {
            try {
              // Fetch product details for each item
              const productResponse = await axios.get(
                `${PRODUCT_SERVICE_URL}/api/products/sku/${item.product_sku_id}`
              );
              
              const productData = productResponse.data.data;
              
              return {
                ...item,
                product_id: productData.product?.id,
                product_name: productData.product?.name,
                product_image: productData.product?.image_thumbnail,
                sku_name: `${productData.sku} - ${productData.brand_name || ''}`,
                sku_code: productData.sku,
                brand_name: productData.brand_name
              };
            } catch (error) {
              console.error(`Error fetching product details for SKU ${item.product_sku_id}:`, error.message);
              return {
                ...item,
                product_name: 'Unknown Product',
                product_image: '/images/default-product.jpg',
                sku_name: 'Unknown SKU'
              };
            }
          }));

          cartData.items = items;
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }

      // Calculate totals
      const subtotal = cartData.items?.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity), 0) || 0;
      const discount = parseFloat(cart.discount_amount) || 0;
      const total = subtotal - discount;

      res.json({
        success: true,
        data: {
          ...cartData,
          subtotal,
          discount,
          total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { product_id, sku_id, quantity = 1 } = req.body;

      // Verify product and SKU exist and get price
      let price;
      try {
        // First check if SKU has stock
        const skuResponse = await axios.get(
          `${PRODUCT_SERVICE_URL}/api/products/sku/${sku_id}/stock`
        );
        
        if (!skuResponse.data.data.is_available) {
          return res.status(400).json({
            success: false,
            message: 'Product is out of stock'
          });
        }
        
        // Get product with SKU details to fetch price
        const productResponse = await axios.get(
          `${PRODUCT_SERVICE_URL}/api/products/${product_id}`
        );
        
        const sku = productResponse.data.data.skus.find(s => s.id === sku_id);
        if (!sku) {
          return res.status(400).json({
            success: false,
            message: 'SKU not found for this product'
          });
        }
        
        price = sku.price;
      } catch (error) {
        console.error('Error fetching product/SKU:', error.message);
        return res.status(400).json({
          success: false,
          message: 'Invalid product or SKU'
        });
      }

      // Find or create cart
      let cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        cart = await Cart.create({ user_id: userId });
      }

      // Check if item already exists in cart
      let cartItem = await CartItem.findOne({
        where: { 
          cart_id: cart.id, 
          product_sku_id: sku_id 
        }
      });

      if (cartItem) {
        // Update quantity
        await cartItem.update({ 
          quantity: cartItem.quantity + parseInt(quantity) 
        });
      } else {
        // Add new item
        cartItem = await CartItem.create({
          cart_id: cart.id,
          product_sku_id: sku_id,
          quantity: parseInt(quantity),
          price
        });
      }

      res.json({
        success: true,
        message: 'Item added to cart',
        data: cartItem
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { item_id } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      const cartItem = await CartItem.findOne({
        where: { 
          id: item_id, 
          cart_id: cart.id 
        }
      });

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

      await cartItem.update({ quantity: parseInt(quantity) });

      res.json({
        success: true,
        message: 'Cart item updated',
        data: cartItem
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { item_id } = req.params;

      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      const cartItem = await CartItem.findOne({
        where: { 
          id: item_id, 
          cart_id: cart.id 
        }
      });

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

      await cartItem.destroy();

      res.json({
        success: true,
        message: 'Item removed from cart'
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];

      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        return res.json({
          success: true,
          message: 'Cart is already empty'
        });
      }

      await CartItem.destroy({ where: { cart_id: cart.id } });
      await cart.update({ discount_code: null, discount_amount: 0 });

      res.json({
        success: true,
        message: 'Cart cleared'
      });
    } catch (error) {
      next(error);
    }
  }

  async applyDiscount(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { discount_code } = req.body;

      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      // In production, validate discount code with a Coupon Service
      // For now, simple validation
      const discountAmount = 10.00; // Example fixed discount

      await cart.update({ 
        discount_code, 
        discount_amount: discountAmount 
      });

      res.json({
        success: true,
        message: 'Discount applied',
        data: {
          discount_code,
          discount_amount: discountAmount
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
