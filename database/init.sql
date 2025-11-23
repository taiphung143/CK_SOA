SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Create databases for each microservice
CREATE DATABASE IF NOT EXISTS user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS product_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS cart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS order_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS notification_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- =====================================================
-- USER SERVICE DATABASE
-- =====================================================
USE user_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    avatar VARCHAR(255) DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birth DATE DEFAULT NULL,
    phone_number VARCHAR(20) DEFAULT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    verified_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert users data
INSERT INTO users (id, avatar, name, username, email, password, birth, phone_number, is_verified, role, verified_at, created_at) VALUES
(1, 'images/avatars/1_1751557568_share-poster-1749998037227.jpg', 'Tai The Phung', 'taiphung143', 'taiphung143@gmail.com', '$2y$12$nABXTUHDb.J8fOt8g7yAs.M8pMGkYb9beSlt0YLekS9HwDhdnMNXK', '2005-03-14', '0335526427', 1, 'admin', '2025-04-17 17:41:18', '2025-04-17 17:39:11'),
(7, 'images/avatars/7_1748276672_doge.jpg', 'buithai son', 'buithaison', 'bts18062005@gmail.com', '$2y$12$.YD6Rfovsl6I6/a/Nh2ngegSDDZmP74y21lJSYfjB9dg0l87g04r2', NULL, '', 1, 'admin', '2025-04-20 12:56:39', '2025-04-20 12:56:17'),
(16, '', 'The Taii Phung222', 'uhuwfmi223', 'phungtai143@gmail.com', '$2y$12$gCccRyDA1PPq11Ks0wmqKudyZXTw5K3nNr2Nf/6myDFZ1kh7v6Kiu', NULL, '', 1, 'user', NULL, '2025-05-24 14:23:56'),
(19, 'images/avatars/19_1751787058_Ảnh màn hình 2025-06-21 lúc 11.24.40.png', 'The Tai', 'taiphungshopee1', 'taiphungshopee1@gmail.com', '$2y$12$Te6WlxlxTPjxwOSIBpoiWew7XzgKbn7RZbD.YUzoZX27snkjBsgxS', '2025-05-15', '0123456789', 1, 'user', '2025-05-26 15:51:53', '2025-05-26 15:51:26');

-- User tokens table
CREATE TABLE IF NOT EXISTS user_tokens (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    type ENUM('verification', 'password_reset') NOT NULL DEFAULT 'verification',
    is_used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert user tokens
INSERT INTO user_tokens (user_id, token, type, is_used, created_at, expires_at) VALUES
(1, '8284b8a2b61cc5e3c7124bb8c86ff94e', 'verification', 1, '2025-04-17 17:39:12', '2025-04-18 17:39:12'),
(7, '445eaa81e06d9b297e4978ac89dba60d', 'verification', 1, '2025-04-20 12:56:17', '2025-04-21 12:56:17'),
(16, '023e8a8bd7cdf80c3fc4f51dcf038e91', 'verification', 0, '2025-05-24 14:23:56', '2025-05-25 14:23:56'),
(19, '20e3c5e74a0c70b0c417b54dc2242a48', 'verification', 1, '2025-05-26 15:51:26', '2025-05-27 15:51:26');

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT NULL,
    postal_code VARCHAR(20) DEFAULT NULL,
    country VARCHAR(100) DEFAULT 'Vietnam',
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert addresses
INSERT INTO addresses (id, user_id, recipient_name, phone, street_address, city, state, postal_code, country, is_default, created_at) VALUES
(1, 1, 'Tai The Phung', '0947334392', '48/4 Le Duan Street, An Lac Su', 'Dak Lak Province', 'aj', '634700', 'Vietnam', 0, '2025-04-17 18:35:27'),
(6, 7, '1', '1', '1', '1', '1', '1', 'Vietnam', 0, '2025-05-14 09:32:29'),
(7, 1, 'Tai The Phung', '0947334392', '48/4 Le Duan Street, An Lac Su', 'Dak Lak Province', 'aj', '634700', 'Vietnam', 0, '2025-05-24 05:48:55'),
(14, 1, 'Tai The Phung', '0947334392', '48/4 Le Duan Street, An Lac Su', 'Dak Lak Province', 'aj', '634700', 'Vietnam', 0, '2025-05-24 14:44:13'),
(16, 19, 'The Tai', '0123456789', '123', 'HCM', 'Q7', '634700', 'Vietnam', 0, '2025-05-26 15:54:15');

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    message TEXT,
    newsletter TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert contacts
INSERT INTO contacts (id, first_name, last_name, email, phone, message, newsletter, created_at) VALUES
(1, 'Tuan', 'Ho', '52300077@gmail.com', '123456', 'SELECT * FROM Users', 1, '2025-05-10 07:32:57'),
(2, 'SELECT * FROM cart', 'asd', 'asd@das.com', 'asd', 'asda', 1, '2025-05-10 07:33:38'),
(9, 'Phan', 'Thắng', 'lehang.com86@gmail.com', '0703587446', 'ĐƯA CỜ TƯ LỆNH TRỞ NÊN PHỔ BIẾN TOÀN THẾ GIỚI', 1, '2025-05-24 13:36:12');

-- Submission tracking table
CREATE TABLE IF NOT EXISTS submission_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    submission_time DATETIME NOT NULL,
    INDEX idx_ip_time (ip_address, submission_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert submission tracking
INSERT INTO submission_tracking (id, ip_address, submission_time) VALUES
(1, '::1', '2025-05-14 09:15:52'),
(2, '::1', '2025-05-14 09:16:59');

-- =====================================================
-- PRODUCT SERVICE DATABASE
-- =====================================================
USE product_db;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert categories
INSERT INTO categories (id, name, slug, description, image, active, created_at, updated_at) VALUES
(1, 'Electronics', 'electronics', 'Smartphones, laptops, and tech gadgets', 'https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:04:09'),
(2, 'Fashion', 'fashion', 'Clothing, shoes, and accessories for all', 'https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:04:27'),
(3, 'Home & Living', 'home-living', 'Furniture, decor, kitchen & more', 'https://down-vn.img.susercontent.com/file/24b194a695ea59d384768b7b471d563f@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:06:07'),
(4, 'Beauty & Personal Care', 'beauty-personal-care', 'Cosmetics, skincare, grooming', 'https://down-vn.img.susercontent.com/file/ef1f336ecc6f97b790d5aae9916dcb72@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:03:06'),
(5, 'Sports & Outdoors', 'sports-outdoors', 'Fitness equipment, outdoor gear', 'https://down-vn.img.susercontent.com/file/6cb7e633f8b63757463b676bd19a50e4@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:06:20'),
(6, 'Toys & Games', 'toys-games', 'Toys for kids, board games & hobbies', 'https://down-vn.img.susercontent.com/file/ce8f8abc726cafff671d0e5311caa684@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:06:00'),
(7, 'Books & Stationery', 'books-stationery', 'Books, journals, school & office supplies', 'https://down-vn.img.susercontent.com/file/36013311815c55d303b0e6c62d6a8139@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:03:14'),
(8, 'Automotive', 'automotive', 'Car accessories, tools, and parts', 'https://down-vn.img.susercontent.com/file/3fb459e3449905545701b418e8220334@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:00:39'),
(9, 'Groceries', 'groceries', 'Food, beverages, and daily essentials', 'https://down-vn.img.susercontent.com/file/c432168ee788f903f1ea024487f2c889@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:04:37'),
(10, 'Pet Supplies', 'pet-supplies', 'Pet food, toys, grooming & more', 'https://down-vn.img.susercontent.com/file/cdf21b1bf4bfff257efe29054ecea1ec@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:06:15');

-- Sub-categories table
CREATE TABLE IF NOT EXISTS sub_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert sub-categories
INSERT INTO sub_categories (id, parent_id, name, description, image, active, created_at, updated_at) VALUES
(1, 1, 'Smartphones', 'Latest iOS and Android phones', '/images/sub-categories/smartphones.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(2, 1, 'Laptops', 'Personal, business, and gaming laptops', '/images/sub-categories/laptops.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(3, 1, 'Headphones', 'Wireless, noise-cancelling, earbuds', '/images/sub-categories/headphones.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(4, 2, 'Men\'s Clothing', 'T-Shirts, jeans, jackets, and more', '/images/sub-categories/mens_clothing.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(5, 2, 'Women\'s Clothing', 'Dresses, tops, skirts, and more', '/images/sub-categories/womens_clothing.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(6, 2, 'Accessories', 'Watches, bags, jewelry', '/images/sub-categories/fashion_accessories.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(7, 3, 'Furniture', 'Sofas, tables, beds, and chairs', '/images/sub-categories/furniture.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(8, 3, 'Kitchen & Dining', 'Cookware, appliances, and tools', '/images/sub-categories/kitchen_dining.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54');

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    description_2 TEXT DEFAULT NULL,
    category_id INT DEFAULT NULL,
    sub_category_id INT DEFAULT NULL,
    image_thumbnail VARCHAR(255) DEFAULT NULL,
    is_featured TINYINT(1) DEFAULT 0,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES sub_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_sub_category (sub_category_id),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert products (sample - add all 59 products)
INSERT INTO products (id, name, description, description_2, category_id, sub_category_id, image_thumbnail, is_featured, active, created_at, updated_at) VALUES
(1, 'iPhone 15 Pro Max', 'Latest flagship from Apple with advanced camera system', 'Display: 6.7-inch Super Retina XDR OLED, Processor: A17 Pro chip', 1, 1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llxe7xfysdlr0a_tn.webp', 1, 1, '2025-04-18 05:19:10', '2025-04-27 05:41:25'),
(2, 'Samsung Galaxy S24 Ultra', 'High-end Android phone with a powerful zoom lens', 'Snapdragon 8 Gen 3, S-Pen support', 1, 1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly21iyd2f5y3bf@res', 1, 1, '2025-04-18 05:19:10', '2025-04-20 08:03:42');

-- Product SKUs table
CREATE TABLE IF NOT EXISTS product_skus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    brand_name VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert product SKUs (sample - add all SKUs)
INSERT INTO product_skus (id, product_id, sku, price, stock, brand_name, created_at, updated_at) VALUES
(1, 1, 'IP15PM-BLACK-256GB', 30000000.00, 20, 'Apple', '2025-04-18 05:22:09', '2025-05-26 15:27:44'),
(2, 1, 'IP15PM-TITANIUM-512GB', 32000000.00, 10, 'Apple', '2025-04-18 05:22:09', '2025-05-26 15:27:49'),
(3, 2, 'SGS24U-GREEN-256GB', 1199.99, 25, 'Samsung', '2025-04-18 05:22:09', '2025-04-18 05:22:09');

-- Product attributes table
CREATE TABLE IF NOT EXISTS product_attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert product attributes
INSERT INTO product_attributes (id, type, value) VALUES
(1, 'Color', 'Black'),
(2, 'Color', 'Silver'),
(3, 'Color', 'Blue'),
(4, 'Color', 'Green'),
(5, 'Color', 'Titanium'),
(6, 'Storage', '128GB'),
(7, 'Storage', '256GB'),
(8, 'Storage', '512GB'),
(9, 'Storage', '1TB');

-- SKU attributes junction table
CREATE TABLE IF NOT EXISTS sku_attributes (
    sku_id INT NOT NULL,
    attribute_id INT NOT NULL,
    PRIMARY KEY (sku_id, attribute_id),
    FOREIGN KEY (sku_id) REFERENCES product_skus(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES product_attributes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert SKU attributes mappings
INSERT INTO sku_attributes (sku_id, attribute_id) VALUES
(1, 1), (1, 7),
(2, 5), (2, 8),
(3, 4), (3, 7);

-- Product discounts table
CREATE TABLE IF NOT EXISTS product_discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    discount_percent INT NOT NULL,
    start_at DATETIME DEFAULT NULL,
    end_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_dates (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert product discounts
INSERT INTO product_discounts (id, product_id, discount_percent, start_at, end_at, created_at, updated_at) VALUES
(1, 1, 50, '2025-04-27 00:46:20', '2025-05-27 12:46:20', '2025-04-27 05:46:36', '2025-05-26 15:37:00'),
(2, 2, 50, '2025-05-09 14:31:11', '2025-05-11 14:31:11', '2025-05-10 07:31:33', '2025-05-10 07:31:33');

-- Recently viewed products
CREATE TABLE IF NOT EXISTS recently_viewed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_view (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert recently viewed
INSERT INTO recently_viewed (id, user_id, product_id, viewed_at) VALUES
(46, 7, 15, '2025-05-23 09:03:01'),
(56, 7, 12, '2025-05-25 00:15:38'),
(57, 7, 1, '2025-05-25 00:18:04');

-- =====================================================
-- CART SERVICE DATABASE
-- =====================================================
USE cart_db;

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'abandoned', 'ordered') DEFAULT 'active',
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert carts (sample)
INSERT INTO cart (id, user_id, created_at, updated_at, status) VALUES
(1, 1, '2025-04-23 06:09:00', '2025-04-23 07:05:55', 'ordered'),
(2, 1, '2025-04-23 07:08:54', '2025-04-23 07:09:08', 'ordered'),
(46, 1, '2025-09-10 06:54:18', '2025-09-10 06:54:18', 'active');

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_sku_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    original_price DECIMAL(10, 2) DEFAULT NULL,
    has_discount TINYINT(1) DEFAULT 0,
    discount_percent INT DEFAULT 0,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    INDEX idx_cart (cart_id),
    INDEX idx_product_sku (product_sku_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert cart items (sample)
INSERT INTO cart_item (id, cart_id, product_sku_id, quantity, price, added_at, original_price, has_discount, discount_percent) VALUES
(1, 1, 1, 30, 1199.99, '2025-04-23 06:09:00', 1199.99, 0, 0),
(66, 46, 1, 1, 30000000.00, '2025-09-30 19:28:39', 30000000.00, 0, 0);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert wishlist items
INSERT INTO wishlist (id, user_id, product_id, added_at) VALUES
(28, 7, 14, '2025-05-22 17:49:11'),
(39, 1, 1, '2025-08-27 05:16:33');

-- =====================================================
-- ORDER SERVICE DATABASE
-- =====================================================
USE order_db;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cart_id INT DEFAULT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
    shipping_address_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_cart_id (cart_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert orders (sample)
INSERT INTO orders (id, user_id, cart_id, total, status, shipping_address_id, created_at, updated_at) VALUES
(1, 1, 1, 35999.70, 'pending', NULL, '2025-04-23 07:05:54', '2025-04-23 07:05:54'),
(2, 1, 2, 17999.85, 'paid', NULL, '2025-04-23 07:09:08', '2025-04-23 07:09:28'),
(39, 1, 45, 30010000.00, 'pending', 1, '2025-08-19 10:00:15', '2025-08-19 10:00:15');

-- Order items table
CREATE TABLE IF NOT EXISTS order_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_sku_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_product_sku (product_sku_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert order items (sample)
INSERT INTO order_item (id, order_id, product_sku_id, quantity, price) VALUES
(1, 1, 1, 30, 1199.99),
(2, 2, 1, 15, 1199.99),
(56, 39, 8, 1, 10000.00);

-- Vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    start_at DATETIME DEFAULT NULL,
    end_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_dates (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert vouchers
INSERT INTO vouchers (id, code, discount_percent, start_at, end_at, created_at, updated_at) VALUES
(9, 'SHOP10', 10, '2025-05-26 00:00:00', '2025-06-25 00:00:00', '2025-05-26 15:20:36', '2025-05-26 15:20:36'),
(13, 'SGYL58', 99, '2025-07-06 00:00:00', '2025-08-05 00:00:00', '2025-07-06 07:33:04', '2025-07-06 07:33:04');

-- =====================================================
-- PAYMENT SERVICE DATABASE
-- =====================================================
USE payment_db;

-- Payment details table
CREATE TABLE IF NOT EXISTS payment_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    method ENUM('vnpay', 'momo', 'cod') NOT NULL,
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(255) DEFAULT NULL,
    paid_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_order (order_id),
    INDEX idx_transaction (transaction_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert payment details (sample)
INSERT INTO payment_details (id, order_id, method, status, amount, transaction_id, paid_at) VALUES
(1, 1, 'vnpay', 'pending', 35999.70, NULL, NULL),
(2, 2, 'vnpay', 'paid', 17999.85, '14922134', '2025-04-23 14:09:36'),
(39, 39, 'vnpay', 'failed', 30010000.00, NULL, NULL);

-- =====================================================
-- NOTIFICATION SERVICE DATABASE
-- =====================================================
USE notification_db;

-- Notification Templates Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    channel ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    variables JSON,
    is_active TINYINT(1) DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert notification templates
INSERT INTO notification_templates (name, code, channel, subject, body, variables) VALUES
('User Email Verification', 'USER_VERIFICATION', 'email', 'Verify Your Email Address', 
 '<div style="font-family: Arial, sans-serif;"><h2>Welcome to Shop365!</h2><p>Hi {{userName}},</p><p>Please verify your email: <a href="{{verificationUrl}}">Verify Email</a></p></div>', 
 '["userName", "verificationUrl"]'),
('Password Reset', 'PASSWORD_RESET', 'email', 'Reset Your Password',
 '<div style="font-family: Arial, sans-serif;"><h2>Password Reset</h2><p>Hi {{userName}},</p><p>Click to reset: <a href="{{resetUrl}}">Reset Password</a></p></div>',
 '["userName", "resetUrl"]'),
('Order Confirmation', 'ORDER_CONFIRMATION', 'email', 'Order Confirmation - {{orderNumber}}',
 '<div style="font-family: Arial, sans-serif;"><h2>Order Confirmed!</h2><p>Hi {{customerName}},</p><p>Order #{{orderNumber}} confirmed. Total: {{totalAmount}} VND</p></div>',
 '["customerName", "orderNumber", "totalAmount"]');

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    recipient VARCHAR(255) NOT NULL,
    channel ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
    template_code VARCHAR(50),
    subject VARCHAR(255),
    body TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'read') DEFAULT 'pending',
    error_message TEXT,
    sent_at DATETIME,
    read_at DATETIME,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_channel (channel),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    template_id INT,
    segment ENUM('all_users', 'verified_users', 'customers', 'inactive_users', 'custom') DEFAULT 'all_users',
    segment_filter JSON,
    status ENUM('draft', 'scheduled', 'sending', 'sent', 'cancelled') DEFAULT 'draft',
    scheduled_at DATETIME,
    sent_at DATETIME,
    total_recipients INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    opened_count INT DEFAULT 0,
    clicked_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES notification_templates(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    email_enabled TINYINT(1) DEFAULT TRUE,
    sms_enabled TINYINT(1) DEFAULT TRUE,
    push_enabled TINYINT(1) DEFAULT TRUE,
    marketing_emails TINYINT(1) DEFAULT TRUE,
    order_updates TINYINT(1) DEFAULT TRUE,
    promotions TINYINT(1) DEFAULT TRUE,
    newsletter TINYINT(1) DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Notification Events Table
CREATE TABLE IF NOT EXISTS notification_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    template_code VARCHAR(50) NOT NULL,
    channel ENUM('email', 'sms', 'push', 'in_app', 'all') DEFAULT 'email',
    is_active TINYINT(1) DEFAULT TRUE,
    delay_minutes INT DEFAULT 0,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert notification events
INSERT INTO notification_events (event_type, template_code, channel, is_active) VALUES
('user.registered', 'USER_VERIFICATION', 'email', TRUE),
('password.reset_requested', 'PASSWORD_RESET', 'email', TRUE),
('order.created', 'ORDER_CONFIRMATION', 'email', TRUE);

COMMIT;