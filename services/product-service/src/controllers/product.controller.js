const { Product, ProductSKU, SubCategory } = require('../models');
const { Op } = require('sequelize');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 12, 
        categoryId: category_id, 
        search, 
        minPrice: min_price, 
        maxPrice: max_price,
        sortBy: sort_by = 'created_at',
        order = 'DESC',
        is_featured
      } = req.query;

      // Map sortBy values to actual column names
      const sortColumnMap = {
        'newest': 'created_at',
        'oldest': 'created_at',
        'name': 'name',
        'price': 'base_price',
        'popularity': 'view_count'
      };
      
      const actualSortBy = sortColumnMap[sort_by] || sort_by;
      
      // Adjust order for certain sort options
      let actualOrder = order;
      if (sort_by === 'oldest') actualOrder = 'ASC';

      const offset = (page - 1) * limit;
      const whereClause = { active: true };

      if (category_id) whereClause.category_id = category_id;
      if (is_featured) whereClause.is_featured = true;
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          { 
            model: SubCategory, 
            as: 'category',
            attributes: ['id', 'name', 'parent_id'],
            include: [
              {
                model: require('../models').Category,
                as: 'parent',
                attributes: ['id', 'name', 'slug']
              }
            ]
          },
          { 
            model: ProductSKU, 
            as: 'skus',
            where: { stock: { [Op.gt]: 0 } },
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[actualSortBy, actualOrder]],
        distinct: true
      });

      res.json({
        success: true,
        data: {
          products: rows,
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

  async getProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findOne({
        where: { id, active: true },
        include: [
          { 
            model: SubCategory, 
            as: 'category',
            attributes: ['id', 'name', 'parent_id'],
            include: [
              {
                model: require('../models').Category,
                as: 'parent',
                attributes: ['id', 'name', 'slug']
              }
            ]
          },
          { 
            model: ProductSKU, 
            as: 'skus'
          }
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const { 
        category_id, 
        sub_category_id,
        name, 
        description,
        description_2,
        image_thumbnail,
        is_featured,
        skus
      } = req.body;

      console.log('Creating product with data:', {
        category_id,
        sub_category_id,
        name,
        description,
        description_2,
        image_thumbnail,
        is_featured
      });

      const product = await Product.create({
        category_id,
        sub_category_id,
        name,
        description,
        description_2,
        image_thumbnail,
        is_featured: is_featured || false,
        active: true
      }, {
        fields: ['category_id', 'sub_category_id', 'name', 'description', 'description_2', 'image_thumbnail', 'is_featured', 'active']
      });

      console.log('✅ Product created with ID:', product.id);

      // Create SKUs if provided
      if (skus && skus.length > 0) {
        const skuData = skus.map(sku => ({
          ...sku,
          product_id: product.id
        }));
        await ProductSKU.bulkCreate(skuData);
        console.log(`✅ Created ${skuData.length} SKUs for product ${product.id}`);
      }

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      console.error('❌ Product creation error:', error);
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.update(updateData);

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Soft delete
      await product.update({ active: false });

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async checkStock(req, res, next) {
    try {
      const { sku_id } = req.params;

      const sku = await ProductSKU.findByPk(sku_id);
      if (!sku) {
        return res.status(404).json({
          success: false,
          message: 'SKU not found'
        });
      }

      const availableStock = sku.stock - (sku.pending_stock || 0);
      
      res.json({
        success: true,
        data: {
          sku_id: sku.id,
          price: sku.price,
          stock_quantity: sku.stock,
          pending_stock: sku.pending_stock || 0,
          available_stock: availableStock,
          is_available: availableStock > 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getSKU(req, res, next) {
    try {
      const { sku_id } = req.params;

      const sku = await ProductSKU.findOne({
        where: { id: sku_id },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'description', 'image_thumbnail', 'category_id']
          }
        ]
      });

      if (!sku) {
        return res.status(404).json({
          success: false,
          message: 'SKU not found'
        });
      }

      res.json({
        success: true,
        data: sku
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req, res, next) {
    try {
      const { sku_id } = req.params;
      const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

      const sku = await ProductSKU.findByPk(sku_id);
      if (!sku) {
        return res.status(404).json({
          success: false,
          message: 'SKU not found'
        });
      }

      let newQuantity = sku.stock;
      if (operation === 'add') {
        newQuantity += parseInt(quantity);
      } else if (operation === 'subtract') {
        newQuantity -= parseInt(quantity);
        if (newQuantity < 0) newQuantity = 0;
      } else {
        newQuantity = parseInt(quantity);
      }

      await sku.update({ 
        stock: newQuantity
      });

      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: {
          sku_id: sku.id,
          stock: sku.stock
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const total = await Product.count({
        where: { active: true }
      });
      
      res.json({
        success: true,
        total: total
      });
    } catch (error) {
      next(error);
    }
  }

  async reserveStock(req, res, next) {
    try {
      const { items } = req.body; // items: [{ sku_id, quantity }]

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required'
        });
      }

      const results = [];
      const unavailableItems = [];

      for (const item of items) {
        const sku = await ProductSKU.findByPk(item.sku_id);
        
        if (!sku) {
          unavailableItems.push({
            sku_id: item.sku_id,
            reason: 'SKU not found'
          });
          continue;
        }

        const availableStock = sku.stock - (sku.pending_stock || 0);
        
        if (availableStock < item.quantity) {
          unavailableItems.push({
            sku_id: item.sku_id,
            requested: item.quantity,
            available: availableStock,
            reason: 'Insufficient stock'
          });
          continue;
        }

        // Reserve stock
        await sku.update({
          pending_stock: (sku.pending_stock || 0) + item.quantity
        });

        results.push({
          sku_id: item.sku_id,
          reserved: item.quantity,
          available_stock: sku.stock - sku.pending_stock
        });
      }

      if (unavailableItems.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Some items are not available',
          unavailableItems
        });
      }

      res.json({
        success: true,
        message: 'Stock reserved successfully',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  async releaseStock(req, res, next) {
    try {
      const { items } = req.body; // items: [{ sku_id, quantity }]

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required'
        });
      }

      for (const item of items) {
        const sku = await ProductSKU.findByPk(item.sku_id);
        
        if (sku) {
          await sku.update({
            pending_stock: Math.max(0, (sku.pending_stock || 0) - item.quantity)
          });
        }
      }

      res.json({
        success: true,
        message: 'Stock released successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmStock(req, res, next) {
    try {
      const { items } = req.body; // items: [{ sku_id, quantity }]

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required'
        });
      }

      for (const item of items) {
        const sku = await ProductSKU.findByPk(item.sku_id);
        
        if (sku) {
          await sku.update({
            stock: Math.max(0, sku.stock - item.quantity),
            pending_stock: Math.max(0, (sku.pending_stock || 0) - item.quantity)
          });
        }
      }

      res.json({
        success: true,
        message: 'Stock confirmed and deducted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
