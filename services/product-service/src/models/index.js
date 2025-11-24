const Category = require('./Category');
const Product = require('./Product');
const ProductSKU = require('./ProductSKU');
const ProductImage = require('./ProductImage');
const SubCategory = require('./SubCategory');
const ProductDiscount = require('./ProductDiscount');
const ProductAttribute = require('./ProductAttribute');
const SkuAttribute = require('./SkuAttribute');
const RecentlyViewed = require('./RecentlyViewed');

// Define associations
Category.hasMany(SubCategory, { foreignKey: 'parent_id', as: 'subcategories' });
SubCategory.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

// Product associations
Product.belongsTo(SubCategory, { foreignKey: 'category_id', as: 'category' });
Product.belongsTo(SubCategory, { foreignKey: 'sub_category_id', as: 'subCategory' });
SubCategory.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

module.exports = {
  Category,
  Product,
  ProductSKU,
  ProductImage,
  SubCategory,
  ProductDiscount,
  ProductAttribute,
  SkuAttribute,
  RecentlyViewed
};
