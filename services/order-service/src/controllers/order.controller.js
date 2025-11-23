const { Order, OrderItem } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://cart-service:3003';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005';

class OrderController {
  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${timestamp}${random}`;
  }

  async createOrder(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { shipping_address, payment_method, notes } = req.body;

      // Get cart from Cart Service
      const cartResponse = await axios.get(`${CART_SERVICE_URL}/api/cart`, {
        headers: { 'x-user-id': userId }
      });
      const cart = cartResponse.data.data;

      if (!cart.items || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      // Calculate totals
      const subtotal = cart.subtotal;
      const discount_amount = cart.discount || 0;
      const shipping_fee = 5.00; // Example fixed shipping fee
      const tax_amount = (subtotal - discount_amount) * 0.1; // 10% tax
      const total_amount = subtotal - discount_amount + shipping_fee + tax_amount;

      // Create order
      const order = await Order.create({
        user_id: userId,
        order_number: this.generateOrderNumber(),
        subtotal,
        discount_amount,
        shipping_fee,
        tax_amount,
        total_amount,
        shipping_address,
        notes: notes || null
      });

      // Create order items
      const orderItems = await Promise.all(cart.items.map(async (item) => {
        return await OrderItem.create({
          order_id: order.id,
          product_id: item.product_id,
          sku_id: item.sku_id,
          product_name: item.product_name || 'Product', // Should come from cart
          sku_attributes: item.attributes || {},
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        });
      }));

      // Update stock in Product Service
      for (const item of cart.items) {
        try {
          await axios.put(
            `${PRODUCT_SERVICE_URL}/api/products/sku/${item.sku_id}/stock`,
            {
              quantity: item.quantity,
              operation: 'subtract'
            }
          );
        } catch (error) {
          console.error('Failed to update stock:', error);
        }
      }

      // Clear cart
      try {
        await axios.delete(`${CART_SERVICE_URL}/api/cart/clear`, {
          headers: { 'x-user-id': userId }
        });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }

      // Create payment if not COD
      if (payment_method !== 'COD') {
        try {
          const paymentResponse = await axios.post(
            `${PAYMENT_SERVICE_URL}/api/payments/create`,
            {
              order_id: order.id,
              amount: total_amount,
              payment_method
            },
            { headers: { 'x-user-id': userId } }
          );

          // Return payment URL if available
          if (paymentResponse.data.data.payment_url) {
            return res.status(201).json({
              success: true,
              message: 'Order created successfully',
              data: {
                order,
                payment_url: paymentResponse.data.data.payment_url
              }
            });
          }
        } catch (error) {
          console.error('Failed to create payment:', error);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { user_id: userId };
      if (status) whereClause.status = status;

      const { count, rows } = await Order.findAndCountAll({
        where: whereClause,
        include: [{ model: OrderItem, as: 'items' }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          orders: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { id } = req.params;

      const order = await Order.findOne({
        where: { id, user_id: userId },
        include: [{ model: OrderItem, as: 'items' }]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      await order.update({ status });

      res.json({
        success: true,
        message: 'Order status updated',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { payment_status } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      await order.update({ 
        payment_status,
        status: payment_status === 'paid' ? 'processing' : order.status
      });

      res.json({
        success: true,
        message: 'Payment status updated',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { id } = req.params;

      const order = await Order.findOne({
        where: { id, user_id: userId }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.status !== 'pending' && order.status !== 'processing') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel order at this stage'
        });
      }

      await order.update({ status: 'cancelled' });

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
