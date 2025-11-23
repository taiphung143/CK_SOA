const { Product, ProductSKU, ProductImage, Category } = require('../models');
const { Op } = require('sequelize');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 12, 
        category_id, 
        search, 
        min_price, 
        max_price,
        sort_by = 'created_at',
        order = 'DESC',
        is_featured
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = { active: true };

      if (category_id) whereClause.category_id = category_id;
      if (is_featured) whereClause.is_featured = true;
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { brand: { [Op.like]: `%${search}%` } }
        ];
      }

      if (min_price || max_price) {
        whereClause.base_price = {};
        if (min_price) whereClause.base_price[Op.gte] = min_price;
        if (max_price) whereClause.base_price[Op.lte] = max_price;
      }

      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          { 
            model: Category, 
            as: 'category',
            attributes: ['id', 'name', 'slug'] 
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
        order: [[sort_by, order]],
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
            model: Category, 
            as: 'category',
            attributes: ['id', 'name', 'slug'] 
          },
          { 
            model: ProductSKU, 
            as: 'skus'
          },
          {
            model: ProductImage,
            as: 'images',
            order: [['display_order', 'ASC']]
          }
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Increment view count
      await product.increment('view_count');

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const product = await Product.findOne({
        where: { slug, active: true },
        include: [
          { 
            model: Category, 
            as: 'category',
            attributes: ['id', 'name', 'slug'] 
          },
          { 
            model: ProductSKU, 
            as: 'skus'
          },
          {
            model: ProductImage,
            as: 'images',
            order: [['display_order', 'ASC']]
          }
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.increment('view_count');

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
        name, 
        slug, 
        description, 
        base_price, 
        discount_percentage,
        brand,
        main_image,
        is_featured,
        skus,
        images
      } = req.body;

      const product = await Product.create({
        category_id,
        name,
        slug,
        description,
        base_price,
        discount_percentage: discount_percentage || 0,
        brand,
        main_image,
        is_featured: is_featured || false
      });

      // Create SKUs if provided
      if (skus && skus.length > 0) {
        const skuData = skus.map(sku => ({
          ...sku,
          product_id: product.id
        }));
        await ProductSKU.bulkCreate(skuData);
      }

      // Create images if provided
      if (images && images.length > 0) {
        const imageData = images.map((img, index) => ({
          product_id: product.id,
          image_url: img.url,
          is_primary: img.is_primary || false,
          display_order: img.display_order || index
        }));
        await ProductImage.bulkCreate(imageData);
      }

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
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

      res.json({
        success: true,
        data: {
          sku_id: sku.id,
          stock_quantity: sku.stock_quantity,
          is_available: sku.is_available && sku.stock_quantity > 0
        }
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

      let newQuantity = sku.stock_quantity;
      if (operation === 'add') {
        newQuantity += parseInt(quantity);
      } else if (operation === 'subtract') {
        newQuantity -= parseInt(quantity);
        if (newQuantity < 0) newQuantity = 0;
      } else {
        newQuantity = parseInt(quantity);
      }

      await sku.update({ 
        stock_quantity: newQuantity,
        is_available: newQuantity > 0
      });

      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: {
          sku_id: sku.id,
          stock_quantity: sku.stock_quantity
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
}

module.exports = new ProductController();
