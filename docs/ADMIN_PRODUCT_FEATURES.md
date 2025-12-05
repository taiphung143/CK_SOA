# Admin Product Management Features

## Add Product Functionality

### Overview
The admin product management page now includes a complete "Add Product" feature that allows administrators to create new products with multiple variants (SKUs).

### Features Implemented

#### 1. **Add Product Button**
- Located at the top right of the Product Management page
- Opens a modal dialog for creating new products

#### 2. **Product Form Fields**
- **Product Name** (required): Name of the product
- **Category** (required): Dropdown with categories and subcategories grouped
- **Thumbnail Image URL**: Main product image path
- **Description** (required): Main product description
- **Additional Description**: Optional secondary description
- **Featured Product**: Checkbox to mark as featured

#### 3. **Product Variants (SKUs)**
Each product can have multiple variants with:
- **Variant Name** (required): e.g., "Red-Medium", "Blue-Large"
- **Price** (required): Price for this variant
- **Stock** (required): Available stock quantity
- **Image URL**: Specific image for this variant

#### 4. **Dynamic SKU Management**
- Start with one SKU by default
- **Add Variant** button: Add more SKUs dynamically
- **Remove (×)** button: Remove SKUs (must keep at least one)

#### 5. **View Product Details**
- Click "View" button to see product details in modal
- Shows:
  - Product image and basic info
  - Status (Active/Inactive)
  - Featured status
  - Full description
  - All variants with prices, stock, and images

### API Endpoints Used

```javascript
// Create Product
POST /api/products
Body: {
  name: string,
  sub_category_id: number,
  category_id: number,
  description: string,
  description_2: string,
  image_thumbnail: string,
  is_featured: boolean,
  skus: [
    {
      sku: string,
      price: number,
      stock: number,
      image: string
    }
  ]
}

// Get Categories
GET /api/products/categories
Response: {
  success: true,
  data: [
    {
      id: number,
      name: string,
      subcategories: [...]
    }
  ]
}

// Get Product Details
GET /api/products/:id
Response: {
  success: true,
  data: {
    id, name, description, category, skus, ...
  }
}
```

### How to Use

1. **Navigate to Admin Panel**
   - Go to `http://localhost:8080/view_admin/product_manage.html`
   - Login as admin

2. **Add New Product**
   - Click "Add Product" button
   - Fill in product details
   - Add variants (SKUs) with prices and stock
   - Click "Create Product"

3. **View Product**
   - Click "View" button on any product
   - See complete product details and variants

### Files Modified

1. **Frontend**
   - `/frontend/src/js/admin/product_manage.js`
     - Added `showAddProductModal()` function
     - Added `handleAddProduct()` function
     - Added dynamic SKU management
     - Added `viewProduct()` and `showProductDetailsModal()` functions
     - Updated `loadCategoriesForForm()` for category dropdown

2. **Backend** (Already existed)
   - `/services/product-service/src/controllers/product.controller.js`
     - `createProduct()` - handles product creation with SKUs
   - `/services/product-service/src/routes/product.routes.js`
     - POST route for creating products

### Example Product Data

```json
{
  "name": "Classic T-Shirt",
  "sub_category_id": 5,
  "category_id": 5,
  "description": "Comfortable cotton t-shirt perfect for everyday wear",
  "description_2": "100% cotton, machine washable",
  "image_thumbnail": "/images/products/tshirt-main.jpg",
  "is_featured": true,
  "skus": [
    {
      "sku": "TSHIRT-RED-M",
      "price": 29.99,
      "stock": 100,
      "image": "/images/products/tshirt-red-m.jpg"
    },
    {
      "sku": "TSHIRT-BLUE-L",
      "price": 29.99,
      "stock": 75,
      "image": "/images/products/tshirt-blue-l.jpg"
    }
  ]
}
```

### Notes

- Admin authentication is handled by the API Gateway
- All products are created as "active" by default
- At least one SKU variant is required
- Categories must exist before creating products
- Product images should be uploaded to `/frontend/src/images/products/` directory

### Future Enhancements

- [ ] Image upload functionality
- [ ] Bulk product import
- [ ] Product duplication
- [ ] Advanced inventory management
- [ ] Product analytics
