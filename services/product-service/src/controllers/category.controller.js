const { Category, Product, SubCategory } = require('../models');

class CategoryController {
  async getAllCategories(req, res, next) {
    try {
      const { include_products = false } = req.query;

      const includeOptions = [];
      if (include_products === 'true') {
        includeOptions.push({
          model: Product,
          as: 'products',
          where: { active: true },
          required: false
        });
      }

      const categories = await Category.findAll({
        where: { active: true },
        include: [
          ...includeOptions,
          {
            model: SubCategory,
            as: 'subcategories',
            where: { active: true },
            required: false
          }
        ],
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findOne({
        where: { id, active: true },
        include: [
          {
            model: SubCategory,
            as: 'subcategories',
            where: { active: true },
            required: false
          }
        ]
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const category = await Category.findOne({
        where: { slug, active: true },
        include: [
          {
            model: SubCategory,
            as: 'subcategories',
            where: { active: true },
            required: false
          }
        ]
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const { name, slug, description, image, parent_id } = req.body;

      const category = await Category.create({
        name,
        slug,
        description,
        image,
        parent_id: parent_id || null
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      await category.update(updateData);

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Check if category has products
      const productCount = await Product.count({
        where: { category_id: id }
      });

      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category with products. Please reassign or delete products first.'
        });
      }

      // Soft delete
      await category.update({ active: false });

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
