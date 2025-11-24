const { Order, OrderItem } = require('../models');
const sequelize = require('../config/database');
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

      console.log('========== CREATE ORDER START ==========');
      console.log('User ID:', userId);
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
      console.log('Payment Method:', payment_method);

      // Get cart from Cart Service
      console.log('Fetching cart from:', `${CART_SERVICE_URL}/api/cart`);
      const cartResponse = await axios.get(`${CART_SERVICE_URL}/api/cart`, {
        headers: { 'x-user-id': userId }
      });
      const cart = cartResponse.data.data;
      console.log('Cart Response:', JSON.stringify(cart, null, 2));

      if (!cart.items || cart.items.length === 0) {
        console.log('❌ Cart is empty');
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

      console.log('Order Calculations:');
      console.log('- Subtotal:', subtotal);
      console.log('- Discount:', discount_amount);
      console.log('- Shipping Fee:', shipping_fee);
      console.log('- Tax:', tax_amount);
      console.log('- Total:', total_amount);

      // Create order
      console.log('Creating order...');
      const order = await Order.create({
        user_id: userId,
        total: total_amount,
        status: 'pending',
        shipping_address_id: null
      });
      console.log('✅ Order created:', order.id);

      // Create order items
      console.log('Creating order items...');
      const orderItems = await Promise.all(cart.items.map(async (item) => {
        return await OrderItem.create({
          order_id: order.id,
          product_sku_id: item.product_sku_id,
          quantity: item.quantity,
          price: item.price
        });
      }));
      console.log(`✅ Created ${orderItems.length} order items`);

      // Update stock in Product Service
      console.log('Updating stock in Product Service...');
      for (const item of cart.items) {
        try {
          await axios.put(
            `${PRODUCT_SERVICE_URL}/api/products/sku/${item.product_sku_id}/stock`,
            {
              quantity: item.quantity,
              operation: 'subtract'
            }
          );
          console.log(`✅ Stock updated for SKU ${item.product_sku_id}`);
        } catch (error) {
          console.error('❌ Failed to update stock:', error.message);
        }
      }

      // Clear cart
      console.log('Clearing cart...');
      try {
        await axios.delete(`${CART_SERVICE_URL}/api/cart/clear`, {
          headers: { 'x-user-id': userId }
        });
        console.log('✅ Cart cleared');
      } catch (error) {
        console.error('❌ Failed to clear cart:', error.message);
      }

      // Create payment if not COD
      if (payment_method !== 'COD') {
        console.log('Creating payment with method:', payment_method);
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
          console.log('Payment Response:', paymentResponse.data);

          // Return payment URL if available
          if (paymentResponse.data.data.payment_url) {
            console.log('✅ Payment URL generated:', paymentResponse.data.data.payment_url);
            console.log('========== CREATE ORDER SUCCESS (WITH PAYMENT) ==========');
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
          console.error('❌ Failed to create payment:', error.message);
        }
      } else {
        console.log('Payment method is COD, skipping payment creation');
      }

      console.log('========== CREATE ORDER SUCCESS ==========');
      const responseData = {
        success: true,
        message: 'Order created successfully',
        data: {
          order: {
            id: order.id,
            user_id: order.user_id,
            total: order.total,
            status: order.status,
            shipping_address_id: order.shipping_address_id,
            created_at: order.created_at,
            updated_at: order.updated_at
          }
        }
      };
      console.log('Response data structure:', JSON.stringify(responseData, null, 2));
      console.log('Order ID in response:', responseData.data.order.id);
      res.status(201).json(responseData);
    } catch (error) {
      console.error('========== CREATE ORDER ERROR ==========');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
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

      // Fetch product details for each order item
      const itemsWithProductDetails = await Promise.all(order.items.map(async (item) => {
        try {
          const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/sku/${item.product_sku_id}`);
          const skuData = productResponse.data.data;

          return {
            id: item.id,
            product_sku_id: item.product_sku_id,
            quantity: item.quantity,
            price: item.price,
            product_name: skuData.product?.name || 'Unknown Product',
            product_image: skuData.product?.image_thumbnail || '../images/default-product.jpg',
            sku_name: skuData.sku || 'N/A'
          };
        } catch (error) {
          console.error(`Failed to fetch product details for SKU ${item.product_sku_id}:`, error.message);
          return {
            id: item.id,
            product_sku_id: item.product_sku_id,
            quantity: item.quantity,
            price: item.price,
            product_name: 'Product Unavailable',
            product_image: '../images/default-product.jpg',
            sku_name: 'N/A'
          };
        }
      }));

      res.json({
        success: true,
        data: {
          ...order.toJSON(),
          items: itemsWithProductDetails
        }
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

  async getStats(req, res, next) {
    try {
      const total = await Order.count();
      
      // Get orders by status
      const statusCounts = await Order.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status']
      });

      const byStatus = {};
      statusCounts.forEach(item => {
        byStatus[item.status] = parseInt(item.dataValues.count);
      });

      res.json({
        success: true,
        total: total,
        byStatus: byStatus
      });
    } catch (error) {
      next(error);
    }
  }

  async getRevenue(req, res, next) {
    try {
      const total = await Order.sum('total_amount') || 0;
      
      // Get monthly revenue for the last 12 months
      const monthlyRevenue = await Order.findAll({
        attributes: [
          [sequelize.fn('YEAR', sequelize.col('created_at')), 'year'],
          [sequelize.fn('MONTH', sequelize.col('created_at')), 'month'],
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'amount']
        ],
        where: {
          created_at: {
            [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        },
        group: ['year', 'month'],
        order: [['year', 'ASC'], ['month', 'ASC']]
      });

      const monthly = monthlyRevenue.map(item => ({
        month: `${item.dataValues.year}-${item.dataValues.month.toString().padStart(2, '0')}`,
        amount: parseFloat(item.dataValues.amount)
      }));

      res.json({
        success: true,
        total: total,
        monthly: monthly
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
