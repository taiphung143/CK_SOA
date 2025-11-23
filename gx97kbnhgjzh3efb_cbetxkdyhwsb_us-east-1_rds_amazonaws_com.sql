-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: gx97kbnhgjzh3efb.cbetxkdyhwsb.us-east-1.rds.amazonaws.com
-- Thời gian đã tạo: Th10 22, 2025 lúc 07:30 AM
-- Phiên bản máy phục vụ: 8.0.42
-- Phiên bản PHP: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ftzkoyt31ojh7gv9`
--
CREATE DATABASE IF NOT EXISTS `ftzkoyt31ojh7gv9` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `ftzkoyt31ojh7gv9`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `addresses`
--

CREATE TABLE `addresses` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Vietnam',
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `recipient_name`, `phone`, `street_address`, `city`, `state`, `postal_code`, `country`, `is_default`, `created_at`) VALUES
(1, 1, 'Tai The Phung', '0947334392', '48/4 Le Duan Street, An Lac Su', 'Dak Lak Province', 'aj', '634700', 'Vietnam', 0, '2025-04-17 18:35:27'),
(6, 7, '1', '1', '1', '1', '1', '1', 'Vietnam', 0, '2025-05-14 09:32:29'),
(7, 1, 'Tai The Phung', '0947334392', '48/4 Le Duan Street, An Lac Su', 'Dak Lak Province', 'aj', '634700', 'Vietnam', 0, '2025-05-24 05:48:55'),
(14, 1, 'Tai The Phung', '0947334392', '48/4 Le Duan Street, An Lac Su', 'Dak Lak Province', 'aj', '634700', 'Vietnam', 0, '2025-05-24 14:44:13'),
(16, 19, 'The Tai', '0123456789', '123', 'HCM', 'Q7', '634700', 'Vietnam', 0, '2025-05-26 15:54:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('active','abandoned','ordered') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `created_at`, `updated_at`, `status`) VALUES
(1, 1, '2025-04-23 06:09:00', '2025-04-23 07:05:55', 'ordered'),
(2, 1, '2025-04-23 07:08:54', '2025-04-23 07:09:08', 'ordered'),
(3, 1, '2025-04-23 07:09:29', '2025-04-23 07:12:10', 'ordered'),
(4, 1, '2025-04-23 07:12:31', '2025-04-23 07:15:02', 'ordered'),
(5, 1, '2025-04-23 07:19:41', '2025-04-23 07:19:57', 'ordered'),
(6, 1, '2025-04-23 07:29:48', '2025-04-23 07:30:25', 'ordered'),
(7, 1, '2025-04-23 07:31:57', '2025-04-23 07:32:12', 'ordered'),
(8, 1, '2025-04-23 07:48:22', '2025-04-23 10:25:35', 'ordered'),
(9, 1, '2025-04-23 10:26:07', '2025-04-26 06:19:05', 'ordered'),
(10, 1, '2025-04-27 03:29:18', '2025-04-27 03:30:01', 'ordered'),
(11, 1, '2025-04-27 06:54:52', '2025-04-27 08:07:38', 'ordered'),
(12, 1, '2025-04-27 08:09:47', '2025-04-27 08:26:01', 'ordered'),
(13, 1, '2025-04-27 17:18:20', '2025-04-27 17:18:30', 'ordered'),
(14, 1, '2025-04-27 17:18:33', '2025-05-07 02:47:42', 'ordered'),
(15, 1, '2025-05-07 03:25:07', '2025-05-15 15:51:31', 'ordered'),
(21, 7, '2025-05-14 09:30:14', '2025-05-14 09:32:46', 'ordered'),
(22, 1, '2025-05-22 12:10:20', '2025-05-22 14:56:37', 'ordered'),
(23, 7, '2025-05-22 13:44:16', '2025-05-22 14:01:27', 'ordered'),
(24, 7, '2025-05-22 14:19:49', '2025-05-22 14:20:09', 'ordered'),
(25, 7, '2025-05-22 14:29:21', '2025-05-22 14:31:28', 'ordered'),
(26, 7, '2025-05-22 14:34:07', '2025-05-22 14:35:43', 'ordered'),
(27, 1, '2025-05-22 15:08:53', '2025-05-22 15:09:20', 'ordered'),
(28, 1, '2025-05-22 15:20:40', '2025-05-22 17:40:31', 'ordered'),
(29, 7, '2025-05-22 16:53:36', '2025-05-22 17:54:56', 'ordered'),
(30, 1, '2025-05-22 17:41:30', '2025-05-24 13:38:50', 'ordered'),
(31, 7, '2025-05-22 18:01:46', '2025-05-22 18:15:41', 'ordered'),
(32, 7, '2025-05-23 02:49:35', '2025-05-23 09:05:25', 'ordered'),
(34, 1, '2025-05-24 13:52:06', '2025-05-24 14:35:25', 'ordered'),
(35, 1, '2025-05-24 14:43:59', '2025-06-13 06:58:37', 'ordered'),
(36, 7, '2025-05-25 00:15:41', '2025-05-25 00:15:41', 'active'),
(41, 19, '2025-05-26 15:53:20', '2025-05-26 15:54:26', 'ordered'),
(42, 19, '2025-05-26 15:54:53', '2025-05-26 15:54:53', 'active'),
(43, 1, '2025-06-21 07:22:14', '2025-06-24 01:27:49', 'ordered'),
(44, 1, '2025-07-01 05:29:42', '2025-07-03 13:21:36', 'ordered'),
(45, 1, '2025-07-03 15:47:00', '2025-08-19 10:00:15', 'ordered'),
(46, 1, '2025-09-10 06:54:18', '2025-09-10 06:54:18', 'active');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_item`
--

CREATE TABLE `cart_item` (
  `id` int NOT NULL,
  `cart_id` int NOT NULL,
  `product_sku_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `original_price` decimal(10,2) DEFAULT NULL,
  `has_discount` tinyint(1) DEFAULT '0',
  `discount_percent` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `cart_item`
--

INSERT INTO `cart_item` (`id`, `cart_id`, `product_sku_id`, `quantity`, `price`, `added_at`, `original_price`, `has_discount`, `discount_percent`) VALUES
(1, 1, 1, 30, 1199.99, '2025-04-23 06:09:00', 1199.99, 0, 0),
(2, 2, 1, 15, 1199.99, '2025-04-23 07:08:55', 1199.99, 0, 0),
(3, 3, 1, 15, 1199.99, '2025-04-23 07:11:55', 1199.99, 0, 0),
(4, 4, 1, 15, 1199.99, '2025-04-23 07:14:46', 1199.99, 0, 0),
(5, 5, 1, 15, 1199.99, '2025-04-23 07:19:42', 1199.99, 0, 0),
(6, 6, 1, 15, 1199.99, '2025-04-23 07:29:49', 1199.99, 0, 0),
(7, 7, 1, 15, 1199.99, '2025-04-23 07:31:58', 1199.99, 0, 0),
(8, 8, 1, 16, 1199.99, '2025-04-23 07:48:23', 1199.99, 0, 0),
(12, 8, 82, 1, 1400.00, '2025-04-23 08:05:58', 1400.00, 0, 0),
(13, 8, 79, 1, 2800.00, '2025-04-23 08:06:22', 2800.00, 0, 0),
(15, 9, 1, 1, 1199.99, '2025-04-26 06:18:46', 1199.99, 0, 0),
(16, 10, 1, 1, 1199.99, '2025-04-27 03:29:19', 1199.99, 0, 0),
(17, 11, 1, 4, 600.00, '2025-04-27 06:54:52', 1199.99, 1, 50),
(19, 12, 1, 1, 899.99, '2025-04-27 08:24:38', 1199.99, 1, 25),
(20, 13, 1, 1, 1199.99, '2025-04-27 17:18:20', NULL, 0, 0),
(21, 14, 1, 1, 899.99, '2025-04-28 06:10:04', 1199.99, 1, 25),
(22, 15, 2, 1, 700.00, '2025-05-07 03:25:08', 1399.99, 1, 50),
(28, 21, 26, 1, 80.00, '2025-05-14 09:30:15', NULL, 0, 0),
(29, 22, 1, 2, 1199.99, '2025-05-22 12:10:20', 1199.99, 0, 0),
(30, 23, 25, 1, 80.00, '2025-05-22 13:44:17', 80.00, 0, 0),
(31, 24, 25, 1, 80.00, '2025-05-22 14:19:50', 80.00, 0, 0),
(32, 25, 25, 2, 80.00, '2025-05-22 14:29:22', 80.00, 0, 0),
(33, 26, 26, 1, 80.00, '2025-05-22 14:34:07', 80.00, 0, 0),
(34, 27, 1, 1, 1199.99, '2025-05-22 15:08:54', 1199.99, 0, 0),
(35, 28, 1, 20, 1199.99, '2025-05-22 15:20:41', 1199.99, 0, 0),
(36, 29, 25, 1, 80.00, '2025-05-22 16:53:36', 80.00, 0, 0),
(37, 29, 23, 3, 100.00, '2025-05-22 17:16:59', 100.00, 0, 0),
(38, 28, 2, 1, 1399.99, '2025-05-22 17:39:18', 1399.99, 0, 0),
(39, 30, 17, 6, 399.99, '2025-05-22 17:41:30', 399.99, 0, 0),
(40, 29, 26, 2, 80.00, '2025-05-22 17:49:07', 80.00, 0, 0),
(41, 31, 25, 1, 80.00, '2025-05-22 18:01:46', 80.00, 0, 0),
(42, 31, 23, 3, 100.00, '2025-05-22 18:09:27', 100.00, 0, 0),
(43, 32, 23, 2, 100.00, '2025-05-23 02:49:35', 100.00, 0, 0),
(44, 32, 26, 1, 80.00, '2025-05-23 02:54:39', 80.00, 0, 0),
(45, 30, 83, 1, 100.00, '2025-05-23 04:52:09', 100.00, 0, 0),
(46, 32, 25, 1, 80.00, '2025-05-23 09:03:04', 80.00, 0, 0),
(49, 34, 17, 10, 399.99, '2025-05-24 13:52:06', 399.99, 0, 0),
(51, 34, 2, 20, 700.00, '2025-05-24 14:34:51', 1399.99, 1, 50),
(52, 35, 1, 2, 600.00, '2025-05-24 14:43:59', 1199.99, 1, 50),
(57, 41, 1, 1, 15000000.00, '2025-05-26 15:53:20', 30000000.00, 1, 50),
(58, 36, 1, 1, 15000000.00, '2025-05-26 16:21:57', 30000000.00, 1, 50),
(59, 36, 23, 1, 100.00, '2025-05-26 16:22:18', 100.00, 0, 0),
(60, 43, 82, 7, 1400.00, '2025-06-21 07:22:14', 1400.00, 0, 0),
(61, 43, 52, 8, 200.00, '2025-06-24 01:26:21', 200.00, 0, 0),
(62, 44, 1, 1, 30000000.00, '2025-07-01 05:29:42', 30000000.00, 0, 0),
(63, 45, 1, 1, 30000000.00, '2025-07-03 15:47:00', 30000000.00, 0, 0),
(64, 45, 8, 1, 10000.00, '2025-08-19 10:00:00', 10000.00, 0, 0),
(66, 46, 1, 1, 30000000.00, '2025-09-30 19:28:39', 30000000.00, 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `image`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Electronics', 'Smartphones, laptops, and tech gadgets', 'https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:04:09'),
(2, 'Fashion', 'Clothing, shoes, and accessories for all', 'https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:04:27'),
(3, 'Home & Living', 'Furniture, decor, kitchen & more', 'https://down-vn.img.susercontent.com/file/24b194a695ea59d384768b7b471d563f@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:06:07'),
(4, 'Beauty & Personal Care', 'Cosmetics, skincare, grooming', 'https://down-vn.img.susercontent.com/file/ef1f336ecc6f97b790d5aae9916dcb72@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:03:06'),
(5, 'Sports & Outdoors', 'Fitness equipment, outdoor gear', 'https://down-vn.img.susercontent.com/file/6cb7e633f8b63757463b676bd19a50e4@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:06:20'),
(6, 'Toys & Games', 'Toys for kids, board games & hobbies', 'https://down-vn.img.susercontent.com/file/ce8f8abc726cafff671d0e5311caa684@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:06:00'),
(7, 'Books & Stationery', 'Books, journals, school & office supplies', 'https://down-vn.img.susercontent.com/file/36013311815c55d303b0e6c62d6a8139@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:03:14'),
(8, 'Automotive', 'Car accessories, tools, and parts', 'https://down-vn.img.susercontent.com/file/3fb459e3449905545701b418e8220334@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:00:39'),
(9, 'Groceries', 'Food, beverages, and daily essentials', 'https://down-vn.img.susercontent.com/file/c432168ee788f903f1ea024487f2c889@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:04:37'),
(10, 'Pet Supplies', 'Pet food, toys, grooming & more', 'https://down-vn.img.susercontent.com/file/cdf21b1bf4bfff257efe29054ecea1ec@resize_w320_nl.webp', 1, '2025-04-18 03:19:09', '2025-05-24 08:06:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contacts`
--

CREATE TABLE `contacts` (
  `id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text,
  `newsletter` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `contacts`
--

INSERT INTO `contacts` (`id`, `first_name`, `last_name`, `email`, `phone`, `message`, `newsletter`, `created_at`) VALUES
(1, 'Tuan', 'Ho', '52300077@gmail.com', '123456', 'SELECT * FROM Users', 1, '2025-05-10 07:32:57'),
(2, 'SELECT * FROM cart', 'asd', 'asd@das.com', 'asd', 'asda', 1, '2025-05-10 07:33:38'),
(3, '$password = foo', '$password = foo', 'lunwatuanoi@gmail.com', '$password = foo', '$password = foo', 0, '2025-05-10 07:34:04'),
(4, 'hi', 'hi', 'hihi@gmail.com', '', 's', 0, '2025-05-14 09:09:50'),
(5, 'hi', 'hi', 'hihi@gmail.com', '', '', 0, '2025-05-14 09:15:50'),
(6, 'hi', 'hi', 'hi@gmail.com', '', '', 0, '2025-05-14 09:16:58'),
(7, 'áhdkahdk', 'alshdkádka', 'bts18062005@gmail.com', '0123456798', 'uhưadnnưd', 0, '2025-05-17 07:30:43'),
(8, 'ạdấd', 'jkshdkjáhdkjsa', 'bts18062005@gmail.com', '', '', 0, '2025-05-17 07:31:01'),
(9, 'Phan', 'Thắng', 'lehang.com86@gmail.com', '0703587446', 'ĐƯA CỜ TƯ LỆNH TRỞ NÊN PHỔ BIẾN TOÀN THẾ GIỚI', 1, '2025-05-24 13:36:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `cart_id` int DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','shipped','completed','cancelled') DEFAULT 'pending',
  `shipping_address_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `cart_id`, `total`, `status`, `shipping_address_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 35999.70, 'pending', NULL, '2025-04-23 07:05:54', '2025-04-23 07:05:54'),
(2, 1, 2, 17999.85, 'paid', NULL, '2025-04-23 07:09:08', '2025-04-23 07:09:28'),
(3, 1, 3, 17999.85, 'paid', NULL, '2025-04-23 07:12:09', '2025-04-23 07:12:30'),
(4, 1, 4, 17999.85, 'pending', NULL, '2025-04-23 07:15:02', '2025-04-23 07:15:02'),
(5, 1, 5, 17999.85, 'pending', NULL, '2025-04-23 07:19:56', '2025-04-23 07:19:56'),
(6, 1, 6, 17999.85, 'pending', 1, '2025-04-23 07:30:24', '2025-04-23 07:30:24'),
(7, 1, 7, 17999.85, 'pending', NULL, '2025-04-23 07:32:12', '2025-04-23 07:32:12'),
(8, 1, 8, 23399.84, 'paid', 1, '2025-04-23 10:25:34', '2025-04-23 10:26:04'),
(9, 1, 9, 1199.99, 'pending', NULL, '2025-04-26 06:19:05', '2025-04-26 06:19:05'),
(10, 1, 10, 1199.99, 'pending', NULL, '2025-04-27 03:30:01', '2025-04-27 03:30:01'),
(11, 1, 11, 0.00, 'pending', 1, '2025-04-27 08:07:37', '2025-04-27 08:07:37'),
(13, 1, 13, 1199.99, 'completed', 1, '2025-04-27 17:18:29', '2025-04-27 17:29:14'),
(14, 1, 14, 450.00, 'pending', NULL, '2025-05-07 02:47:41', '2025-05-07 02:47:41'),
(18, 7, 21, 80.00, 'shipped', 6, '2025-05-14 09:32:45', '2025-05-14 09:33:43'),
(19, 1, 15, 350.00, 'shipped', NULL, '2025-05-15 15:51:31', '2025-05-15 15:52:47'),
(20, 7, 23, 80.00, 'pending', 6, '2025-05-22 14:01:26', '2025-05-22 14:01:26'),
(21, 7, 24, 80.00, 'pending', 6, '2025-05-22 14:20:09', '2025-05-22 14:20:09'),
(22, 7, 25, 160.00, 'pending', 6, '2025-05-22 14:31:27', '2025-05-22 14:31:27'),
(23, 7, 26, 80.00, 'pending', 6, '2025-05-22 14:35:42', '2025-05-22 14:35:42'),
(24, 1, 22, 2399.98, 'pending', NULL, '2025-05-22 14:56:37', '2025-05-22 14:56:37'),
(25, 1, 27, 1199.99, 'pending', NULL, '2025-05-22 15:09:20', '2025-05-22 15:09:20'),
(26, 1, 28, 25399.79, 'pending', NULL, '2025-05-22 17:40:31', '2025-05-22 17:40:31'),
(27, 7, 29, 540.00, 'pending', 6, '2025-05-22 17:54:55', '2025-05-22 17:54:55'),
(28, 7, 31, 380.00, 'pending', 6, '2025-05-22 18:15:40', '2025-05-22 18:15:40'),
(29, 7, 32, 360.00, 'pending', 6, '2025-05-23 09:05:25', '2025-05-23 09:05:25'),
(30, 1, 30, 2499.94, 'pending', 7, '2025-05-24 13:38:49', '2025-05-24 13:38:49'),
(31, 1, 34, 10999.90, 'pending', 7, '2025-05-24 14:35:25', '2025-05-24 14:35:25'),
(35, 19, 41, 7500000.00, 'paid', 16, '2025-05-26 15:54:26', '2025-05-26 15:54:53'),
(36, 1, 35, 1200.00, 'pending', 1, '2025-06-13 06:58:37', '2025-06-13 06:58:37'),
(37, 1, 43, 11400.00, 'pending', 7, '2025-06-24 01:27:49', '2025-06-24 01:27:49'),
(38, 1, 44, 30000000.00, 'shipped', 14, '2025-07-03 13:21:36', '2025-07-03 13:23:32'),
(39, 1, 45, 30010000.00, 'pending', 1, '2025-08-19 10:00:15', '2025-08-19 10:00:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_item`
--

CREATE TABLE `order_item` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_sku_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `order_item`
--

INSERT INTO `order_item` (`id`, `order_id`, `product_sku_id`, `quantity`, `price`) VALUES
(1, 1, 1, 30, 1199.99),
(2, 2, 1, 15, 1199.99),
(3, 3, 1, 15, 1199.99),
(4, 4, 1, 15, 1199.99),
(5, 5, 1, 15, 1199.99),
(6, 6, 1, 15, 1199.99),
(7, 7, 1, 15, 1199.99),
(8, 8, 1, 16, 1199.99),
(9, 8, 82, 1, 1400.00),
(10, 8, 79, 1, 2800.00),
(11, 9, 1, 1, 1199.99),
(12, 10, 1, 1, 1199.99),
(13, 11, 1, 4, 600.00),
(15, 13, 1, 1, 1199.99),
(16, 14, 1, 1, 899.99),
(20, 18, 26, 1, 80.00),
(21, 19, 2, 1, 700.00),
(22, 20, 25, 1, 80.00),
(23, 21, 25, 1, 80.00),
(24, 22, 25, 2, 80.00),
(25, 23, 26, 1, 80.00),
(26, 24, 1, 2, 1199.99),
(27, 25, 1, 1, 1199.99),
(28, 26, 1, 20, 1199.99),
(29, 26, 2, 1, 1399.99),
(31, 27, 25, 1, 80.00),
(32, 27, 23, 3, 100.00),
(33, 27, 26, 2, 80.00),
(34, 28, 25, 1, 80.00),
(35, 28, 23, 3, 100.00),
(37, 29, 23, 2, 100.00),
(38, 29, 26, 1, 80.00),
(39, 29, 25, 1, 80.00),
(40, 30, 17, 6, 399.99),
(41, 30, 83, 1, 100.00),
(43, 31, 17, 10, 399.99),
(44, 31, 2, 20, 700.00),
(49, 35, 1, 1, 15000000.00),
(50, 36, 1, 2, 600.00),
(51, 37, 82, 7, 1400.00),
(52, 37, 52, 8, 200.00),
(54, 38, 1, 1, 30000000.00),
(55, 39, 1, 1, 30000000.00),
(56, 39, 8, 1, 10000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_details`
--

CREATE TABLE `payment_details` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `method` enum('vnpay','momo','cod') NOT NULL,
  `status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `amount` decimal(10,2) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_details`
--

INSERT INTO `payment_details` (`id`, `order_id`, `method`, `status`, `amount`, `transaction_id`, `paid_at`) VALUES
(1, 1, 'vnpay', 'pending', 35999.70, NULL, NULL),
(2, 2, 'vnpay', '', 17999.85, '14922134', '2025-04-23 14:09:36'),
(3, 3, 'vnpay', '', 17999.85, '14922147', '2025-04-23 14:12:39'),
(4, 4, 'vnpay', 'failed', 17999.85, NULL, NULL),
(5, 5, 'vnpay', 'failed', 17999.85, NULL, NULL),
(6, 6, 'vnpay', 'failed', 17999.85, NULL, NULL),
(7, 7, 'vnpay', 'failed', 17999.85, NULL, NULL),
(8, 8, 'vnpay', '', 23399.84, '14922716', '2025-04-23 17:26:14'),
(9, 9, 'vnpay', 'pending', 1199.99, NULL, NULL),
(10, 10, 'vnpay', 'failed', 1199.99, NULL, NULL),
(11, 11, 'vnpay', 'pending', 0.00, NULL, NULL),
(13, 13, 'momo', 'pending', 1199.99, NULL, NULL),
(14, 14, 'vnpay', 'pending', 450.00, NULL, NULL),
(18, 18, 'vnpay', 'failed', 80.00, NULL, NULL),
(19, 19, 'vnpay', 'failed', 350.00, NULL, NULL),
(20, 20, 'vnpay', 'failed', 80.00, NULL, NULL),
(21, 21, 'vnpay', 'pending', 80.00, NULL, NULL),
(22, 22, 'vnpay', 'pending', 160.00, NULL, NULL),
(23, 23, 'vnpay', 'pending', 80.00, NULL, NULL),
(24, 24, 'cod', 'pending', 2399.98, NULL, NULL),
(25, 25, 'vnpay', 'pending', 1199.99, NULL, NULL),
(26, 26, 'vnpay', 'pending', 25399.79, NULL, NULL),
(27, 27, 'cod', 'pending', 540.00, NULL, NULL),
(28, 28, 'vnpay', 'pending', 380.00, NULL, NULL),
(29, 29, 'vnpay', 'pending', 360.00, NULL, NULL),
(30, 30, 'cod', 'pending', 2499.94, NULL, NULL),
(31, 31, 'vnpay', 'pending', 10999.90, NULL, NULL),
(35, 35, 'vnpay', '', 7500000.00, '14980866', '2025-05-26 22:55:19'),
(36, 36, 'vnpay', 'pending', 1200.00, NULL, NULL),
(37, 37, 'cod', 'pending', 11400.00, NULL, NULL),
(38, 38, 'cod', 'pending', 30000000.00, NULL, NULL),
(39, 39, 'vnpay', 'failed', 30010000.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `description_2` text,
  `category_id` int DEFAULT NULL,
  `image_thumbnail` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sub_category_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `description_2`, `category_id`, `image_thumbnail`, `is_featured`, `active`, `created_at`, `updated_at`, `sub_category_id`) VALUES
(3, 'Google Pixel 8 Pro', 'Google\'s best Pixel yet with AI photography features', 'Tensor G3, Clean Android', 1, '/images/products/pixel_8.jpg', 1, 1, '2025-04-18 05:19:10', '2025-04-18 10:08:13', 1),
(4, 'OnePlus 12', 'Fast and smooth phone with great design and performance', '120Hz AMOLED, SuperVOOC charging', 1, '/images/products/oneplus_12.jpg', 1, 1, '2025-04-18 05:19:10', '2025-04-18 10:08:13', 1),
(5, 'Xiaomi 14 Pro', 'Feature-rich flagship with Leica optics', 'Snapdragon 8 Gen 3, MIUI 15', 1, '/images/products/xiaomi_14.jpg', 1, 1, '2025-04-18 05:19:10', '2025-04-18 10:08:13', 1),
(6, 'MacBook Pro 16\"', 'High-performance laptop for professionals.', 'M3 Max Chip, Liquid Retina XDR', 1, '/images/products/macbook_pro_16.jpg', 1, 1, '2025-04-18 05:22:33', '2025-04-18 10:08:13', 2),
(7, 'Dell XPS 15', 'Premium laptop with InfinityEdge display.', 'Intel i9, 32GB RAM, 1TB SSD', 1, '/images/products/dell_xps_15.jpg', 1, 1, '2025-04-18 05:22:33', '2025-04-18 10:08:13', 2),
(8, 'HP Spectre x360', 'Convertible laptop with long battery life.', 'Touchscreen, 2-in-1 Design', 1, '/images/products/hp_spectre_x360.jpg', 1, 1, '2025-04-18 05:22:33', '2025-04-18 10:08:13', 2),
(9, 'Asus ROG Zephyrus G15', 'Gaming laptop with powerful specs.', 'AMD Ryzen 9, RTX 4080', 1, '/images/products/asus_rog_g15.jpg', 1, 1, '2025-04-18 05:22:33', '2025-04-18 10:08:13', 2),
(10, 'Lenovo ThinkPad X1 Carbon', 'Ultra-light business laptop.', 'Intel i7, Fingerprint Reader', 1, '/images/products/thinkpad_x1.jpg', 1, 1, '2025-04-18 05:22:33', '2025-04-18 10:08:13', 2),
(11, 'Tai Nghe Bluetooth Không Dây Cao Cấp Định Vị Đổi Tên Tự Động Kết Nối Cảm Ứng', 'Tai nghe Bluetooth không dây cao cấp với thiết kế hiện đại, âm thanh chất lượng cao, và tính năng định vị thông minh. Với khả năng kết nối nhanh chóng và điều khiển cảm ứng tiện lợi, sản phẩm mang đến trải nghiệm nghe nhạc tuyệt vời mọi lúc, mọi nơi. Thời gian sử dụng lên đến 20 giờ, phù hợp cho những ai yêu thích vận động và di chuyển', 'Bluetooth 5.0,sử dụng: 20 giờ,sạc: 1.5 giờ,IPX4', 1, '/images/products/item_1.jpg', 1, 1, '2025-04-19 12:20:28', '2025-05-19 07:48:47', 3),
(12, 'Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation with premium sound quality.', 'Great for work, travel, and immersive listening.', 1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxkwcli7ukezc2', 1, 1, '2025-04-19 12:25:37', '2025-04-19 12:36:04', 3),
(13, 'Tai nghe chụp tai Hoco W21 dòng tai nghe dây hỗ trợ mic đàm thoại chống ồn âm thanh trong', 'Tai nghe chụp tai Hoco W21 mang đến trải nghiệm âm thanh tuyệt vời với khả năng chống ồn hiệu quả. Thiết kế nhẹ và thoải mái giúp bạn sử dụng lâu mà không mệt mỏi. Với microphone tích hợp, tai nghe này hoàn hảo cho việc đàm thoại và nghe nhạc chất lượng cao.\r\n\r\n', 'Supports calls,Clear sound with strong bass', 1, '/images/products/item_2.jpg', 0, 1, '2025-04-19 12:39:35', '2025-05-19 07:48:55', 3),
(14, 'Ultrapods Pro Wireless Bluetooth Earbuds KY9 / KY8', 'The KY9 / KY8 Ultrapods Pro wireless Bluetooth earbuds offer a premium audio experience with Hi-Fi sound quality and convenient touch controls. Featuring a stylish LED display, these earbuds provide up to 20 hours of usage with the charging case. The built-in microphone ensures clear calls, while the IPX4 rating makes them suitable for various activities.', 'Bluetooth Version: V5.3,Sound Quality: Hi-Fi audio, Water Resistance: IPX4', 1, '/images/products/item_3.jpg', 0, 1, '2025-04-19 14:33:05', '2025-05-19 07:49:01', 3),
(15, 'Awifi Case H5-2 Wired Bluetooth Headphones with Mic', 'The Awifi Case H5-2 wired Bluetooth headphones feature an integrated microphone, making them ideal for calls and music. Compatible with a wide range of iPhone models, they offer clear audio quality and a comfortable fit. The in-line remote allows for easy control of volume and calls, perfect for everyday use.', 'Model: Awifi Case H5-2, Connection: Wired, Sound Quality: Clear audio with balanced bass', 1, '/images/products/item_4.jpg', 0, 1, '2025-04-19 14:34:46', '2025-05-19 07:49:10', 3),
(16, 'Men\'s baggy jeans', 'Elevate your casual wardrobe with these men\'s baggy jeans featuring functional side pockets. Designed with a wide-leg silhouette, they provide a relaxed fit that\'s perfect for street style enthusiasts. The jeans are ideal for big sizes, ensuring comfort without compromising on style. Whether paired with a graphic tee or a casual shirt, these jeans are versatile enough for any occasion.', 'Stretchable denim, durable and comfortable to wear.', 2, '/images/products/trouser_1.jpg', 0, 1, '2025-04-19 15:50:38', '2025-05-19 07:49:16', 4),
(17, 'Men\'s Dress Pants with Four White Stripes', 'Men\'s dress pants featuring a sophisticated design with four white stripes, perfect for a stylish look. Ideal for urban boys and fans of Korean fashion, these trousers combine elegance with a modern edge. The tailored fit offers a sharp silhouette, suitable for both casual outings and formal occasions.', 'Made from high-quality, lightweight fabric for comfort and durability, ensuring a stylish look and breathability', 2, '/images/products/trouser_2.jpg', 0, 1, '2025-04-19 15:50:38', '2025-05-19 07:49:23', 4),
(18, 'Unisex Basic Sweatpants', 'These unisex sweatpants feature a relaxed fit with a wide-leg design, perfect for both men and women. Made with a comfortable elastic waistband, they provide ease of movement   and a stylish look. Available in classic colors like black, beige, and gray, these pants are versatile for any casual outfit.', 'Crafted from high-quality fleece fabric, these sweatpants are soft, warm, and durable, making them ideal for everyday wear.', 2, '/images/products/trouser_3.jpg', 0, 1, '2025-04-19 15:50:38', '2025-05-19 07:49:28', 4),
(19, 'Unisex Wide-Leg Jogger Pants with Three Stripes', 'These unisex jogger pants feature a relaxed, wide-leg design and three stylish stripes along the sides. Perfect for both men and women, they offer a trendy look while ensuring comfort. Ideal for casual outings or lounging, these joggers are versatile and fashionable.', 'Made from high-quality, thick, and soft fleece fabric, these pants provide warmth and durability, making them perfect for everyday wear.', 2, '/images/products/trouser_4.jpg', 0, 1, '2025-04-19 15:50:38', '2025-05-19 07:49:33', 4),
(20, 'Yazhiniao Stand Collar Jacket', 'A stylish standing collar jacket inspired by Japanese fashion, perfect for students. This versatile piece adds a modern touch to any outfit.', 'Made from high-quality fabric for comfort and durability.', 2, '/images/products/vest_1.jpg', 0, 1, '2025-04-19 16:08:48', '2025-05-19 07:49:55', 4),
(21, 'KING Premium Gilet', 'Premium four-button gilet designed for a sophisticated look, perfect for office wear. This elegant piece features a refined style with a Korean flair.', 'Crafted from high-quality western fabric for a luxurious feel.', 2, '/images/products/vest_3.jpg', 0, 1, '2025-04-19 16:08:48', '2025-05-19 07:50:08', 4),
(22, 'Lightweight Oversized Blazer', 'A lightweight, oversized blazer available in various styles, perfect for office or casual wear. This secondhand piece emphasizes a vintage aesthetic.', 'Made from soft, breathable fabric for comfort.', 2, '/images/products/vest_4.jpg', 0, 1, '2025-04-19 16:08:48', '2025-05-19 07:51:44', 4),
(23, 'VNXK Fitted Two-Layer Gilet', 'A stylish two-layer vest designed for a fitted look, perfect for a youthful and trendy appearance. This piece is both elegant and comfortable', 'Made from thick, smooth fabric for durability and comfort.', 2, '/images/products/vest_4.jpg', 0, 1, '2025-04-19 16:08:48', '2025-05-19 07:51:55', 4),
(24, 'Two-Strap Dress', 'A unique two-strap dress with a bow detail that can be styled in three different ways. Perfect for parties and outings.', 'High-quality fabric for comfort and style.', 2, '/images/products/dress_1.jpg', 0, 1, '2025-04-19 16:31:52', '2025-05-19 07:52:05', 5),
(25, 'Short Flared Dress', 'A charming short flare dress, designed with a modest cut and includes protective shorts. Perfect for casual outings.', 'Soft and breathable fabric for all-day comfort.', 2, '/images/products/dress_2.jpg', 0, 1, '2025-04-19 16:31:52', '2025-05-19 07:52:17', 5),
(26, 'Floral Layered Dress', 'A floral chiffon dress with layered design and a detachable jacket, perfect for parties and casual outings.', 'Lightweight chiffon for a comfortable fit.', 2, '/images/products/dress_3.jpg', 0, 1, '2025-04-19 16:31:52', '2025-05-19 07:55:47', 5),
(27, 'Off-Shoulder Party Dress', 'An elegant off-shoulder dress with mesh detailing, perfect for parties and special occasions.', 'Quality fabric for a flattering silhouette.', 2, '/images/products/dress_4.jpg', 0, 1, '2025-04-19 16:31:52', '2025-05-19 07:56:00', 5),
(28, 'Bling Off-Shoulder Dress', 'A three-layered off-shoulder dress with puffy sleeves and includes protective shorts. Stylish and elegant for various occasions.', 'High-quality fabric for durability and comfort.', 2, '/images/products/dress_5.jpg', 0, 1, '2025-04-19 16:31:52', '2025-05-19 07:56:13', 5),
(29, 'Bodycon Dress', 'A sexy bodycon dress with a sweetheart neckline and fringe details, perfect for a stylish night out.', 'Comfortable stretch fabric for a flattering fit.', 2, '/images/products/dress_6.jpg', 0, 1, '2025-04-19 16:31:52', '2025-05-19 07:56:37', 5),
(31, 'A-Line Dress', 'A designed A-line dress with a round neckline and button details, suitable for work or casual outings.', 'Quality fabric for a comfortable fit.', 2, '/images/products/dress_9.jpg', 1, 1, '2025-04-19 16:31:52', '2025-05-24 08:32:23', 5),
(41, 'Cup Neck Top', 'A stylish cup neck top with a flared design made from lightweight fabric, perfect for casual outings.', 'High-quality textured fabric for comfort and breathability.', 2, '/images/products/shirt_4.jpg', 1, 1, '2025-04-19 17:51:33', '2025-05-24 08:32:25', 5),
(42, 'Short-Sleeve Shirt', 'A comfortable oversized short-sleeve shirt available in various colors, perfect for casual wear.', 'Soft cotton blend for a relaxed fit.', 2, '/images/products/shirt_5.jpg', 0, 1, '2025-04-19 17:51:33', '2025-05-19 07:57:24', 5),
(43, 'Baby Tee', 'A cute baby tee with a humorous graphic print, made from breathable cotton. Ideal for casual and comfortable wear.', 'Lightweight cotton for maximum comfort.', 2, '/images/products/shirt_7.jpg', 0, 1, '2025-04-19 17:51:33', '2025-05-19 07:57:34', 5),
(44, 'Round Neck T-Shirt', 'A fitted round neck t-shirt made from soft cotton, designed for comfort and style with four-way stretch.', 'High-quality cotton for a comfortable fit.', 2, '/images/products/shirt_8.jpg', 0, 1, '2025-04-19 17:51:33', '2025-05-19 07:57:46', 5),
(45, 'Quartz Watch', 'A stylish ultra-thin quartz watch with a mesh strap and beaded bracelet, perfect for professional settings.', 'High-quality materials for durability and elegance.', 2, '/images/products/watch_1.jpg', 0, 1, '2025-04-19 18:12:21', '2025-05-19 07:57:54', 6),
(46, 'Fashion Watch', 'A trendy fashion watch with a stylish dial, perfect for everyday wear.', 'Durable materials designed for long-lasting use.', 2, '/images/products/watch_2.jpg', 0, 1, '2025-04-19 18:12:21', '2025-05-19 07:58:08', 6),
(47, 'Apple Watch', 'A chic LED watch designed for both men and women, featuring a comfortable rubber strap.', 'Soft rubber for comfort and style', 2, '/images/products/watch_3.jpg', 0, 1, '2025-04-19 18:12:21', '2025-05-19 07:58:16', 6),
(48, 'Waterproof Digital Watch', 'A digital watch with a rubber strap, designed to be waterproof and stylish.', 'Quality rubber for durability and comfort.', 2, '/images/products/watch_4.jpg', 0, 1, '2025-04-19 18:12:21', '2025-05-19 07:58:24', 6),
(49, 'Quartz Bell Watch', 'A fashionable quartz watch with a leather strap, suitable for modern men.', 'Premium leather and quartz for style and precision.', 2, '/images/products/watch_5.jpg', 0, 1, '2025-04-19 18:12:21', '2025-05-19 07:58:35', 6),
(50, 'Fashion Metal Strap Watch', 'A stylish digital watch with a metal strap designed for men.\r\n', 'High-quality metal for durability.', 2, '/images/products/watch_7.jpg', 0, 1, '2025-04-19 18:12:21', '2025-05-19 07:58:42', 6),
(51, 'HuB 602 Premium Watch', 'A premium-quality watch with crystal accents, perfect for both men and women, with a 12-month warranty.', 'Durable materials with elegant finishes.', 2, '/images/products/watch_8.jpg', 0, 1, '2025-04-19 18:12:21', '2025-05-19 07:58:50', 6),
(52, 'Minimalist Quartz Watch', 'A stylish minimalist quartz watch with a leather strap, tailored for trendy men.', 'Quality leather for comfort and style.', 2, '/images/products/watch_10.jpg', 0, 1, '2025-04-19 18:12:21', '2025-05-19 07:58:58', 6),
(53, 'Tier Wooden Bookshelf', 'A stylish 5-tier wooden bookshelf designed to fit in corner spaces, perfect for organizing books and decor.', 'High-quality wood for durability and aesthetic appeal.', 3, '/images/products/furniture_2.jpg', 0, 1, '2025-04-20 08:08:10', '2025-05-19 07:59:12', 7),
(54, 'Shoe Rack', 'A stylish and functional 5-tier shoe rack designed to organize footwear neatly, suitable for various styles and sizes.', 'Durable wood for long-lasting use and aesthetic appeal.', 3, '/images/products/furniture_3.jpg', 0, 1, '2025-04-20 08:27:31', '2025-05-19 07:59:17', 7),
(55, 'Modern Gaming Desk', 'A sleek 1-meter modern gaming desk featuring a round pedestal design, perfect for gaming or working with a stylish touch.', 'High-quality materials for durability and a premium look.', 3, '/images/products/furniture_4.jpg', 0, 1, '2025-04-20 08:35:16', '2025-05-19 07:59:21', 7),
(56, '3-Tier Thermal Lunch Box', 'A 3-tier thermal lunch box that is microwave-safe, designed for office lunches. Made from stainless steel, it keeps food warm and includes complimentary accessories.', 'Stainless steel for durability and insulation.', 3, '/images/products/kitchen_1.jpg', 0, 1, '2025-04-20 08:53:20', '2025-05-19 07:59:24', 8),
(57, 'Air Fryer Parchment Paper', 'Round-shaped parchment paper for air fryers, designed to absorb oil and prevent sticking, making cooking and cleanup easier.', 'Food-grade paper, heat-resistant and non-stick.', 3, '/images/products/kitchen_2.jpg', 0, 1, '2025-04-20 08:53:20', '2025-05-19 07:59:28', 8),
(58, 'Plastic Container', 'Versatile plastic containers suitable for storing ice cream or spices, designed for convenience and durability.', 'Food-safe plastic, lightweight and easy to clean.', 3, '/images/products/kitchen_3.jpg', 0, 1, '2025-04-20 08:53:20', '2025-05-19 07:59:30', 8),
(59, 'Glass Lunch Box (Multiple Sizes)', 'A heat-resistant glass lunch box available in various sizes, designed to be spill-proof and ideal for storing food. Perfect for taking meals on the go.', 'High-quality, heat-resistant glass.', 3, '/images/products/kitchen_4.jpg', 0, 1, '2025-04-20 08:53:20', '2025-05-19 07:59:34', 8);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_attributes`
--

CREATE TABLE `product_attributes` (
  `id` int NOT NULL,
  `type` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `product_attributes`
--

INSERT INTO `product_attributes` (`id`, `type`, `value`) VALUES
(1, 'Color', 'Black'),
(2, 'Color', 'Silver'),
(3, 'Color', 'Blue'),
(4, 'Color', 'Green'),
(5, 'Color', 'Titanium'),
(6, 'Storage', '128GB'),
(7, 'Storage', '256GB'),
(8, 'Storage', '512GB'),
(9, 'Storage', '1TB'),
(10, 'Color', 'Space Gray'),
(11, 'Color', 'Silver'),
(12, 'Color', 'Black'),
(13, 'RAM', '16GB'),
(14, 'RAM', '32GB'),
(15, 'Storage', '512GB SSD'),
(16, 'Storage', '1TB SSD'),
(17, 'color', 'Black'),
(18, 'color', 'Silver'),
(19, 'version', 'Standard'),
(20, 'version', 'With Charging Case'),
(21, 'Color', 'Beige'),
(22, 'Color', 'Red'),
(23, 'Color', 'Yellow'),
(24, 'Color', 'White'),
(25, 'Structure', '3'),
(26, 'Structure', '5'),
(27, 'Combo', '10'),
(28, 'Combo', '30'),
(29, 'Combo', '50'),
(30, 'SIZE', '100G'),
(31, 'SIZE', '200G'),
(32, 'SIZE', '250G'),
(33, 'SIZE', '300G'),
(34, 'SIZE', '400'),
(35, 'SIZE', '500'),
(36, 'SIZE', '750'),
(37, 'SIZE', '1KG'),
(38, 'Compartment', '2'),
(39, 'Compartment', '3'),
(40, 'Compartment', '4');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_discounts`
--

CREATE TABLE `product_discounts` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `discount_percent` int NOT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `product_discounts`
--

INSERT INTO `product_discounts` (`id`, `product_id`, `discount_percent`, `start_at`, `end_at`, `created_at`, `updated_at`) VALUES
(1, 1, 50, '2025-04-27 00:46:20', '2025-05-27 12:46:20', '2025-04-27 05:46:36', '2025-05-26 15:37:00'),
(2, 15, 50, '2025-05-09 14:31:11', '2025-05-11 14:31:11', '2025-05-10 07:31:33', '2025-05-10 07:31:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_skus`
--

CREATE TABLE `product_skus` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `sku` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `brand_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `product_skus`
--

INSERT INTO `product_skus` (`id`, `product_id`, `sku`, `price`, `stock`, `brand_name`, `created_at`, `updated_at`) VALUES
(1, 1, 'IP15PM-BLACK-256GB', 30000000.00, 20, 'Apple', '2025-04-18 05:22:09', '2025-05-26 15:27:44'),
(2, 1, 'IP15PM-TITANIUM-512GB', 32000000.00, 10, 'Apple', '2025-04-18 05:22:09', '2025-05-26 15:27:49'),
(3, 2, 'SGS24U-GREEN-256GB', 1199.99, 25, 'Samsung', '2025-04-18 05:22:09', '2025-04-18 05:22:09'),
(4, 2, 'SGS24U-BLACK-512GB', 1299.99, 15, 'Samsung', '2025-04-18 05:22:09', '2025-04-18 05:22:09'),
(5, 3, 'GP8P-BLUE-128GB', 999.99, 30, 'Google', '2025-04-18 05:22:09', '2025-04-18 05:22:09'),
(6, 4, 'OP12-BLACK-256GB', 899.99, 40, 'OnePlus', '2025-04-18 05:22:09', '2025-04-18 05:22:09'),
(7, 5, 'XM14P-SILVER-512GB', 899.99, 25, 'Xiaomi', '2025-04-18 05:22:09', '2025-04-18 05:22:09'),
(8, 6, 'MBP16-SG-32GB-1TB', 10000.00, 10, 'Apple', '2025-04-18 05:22:49', '2025-05-07 04:29:24'),
(9, 7, 'XPS15-SILVER-32GB-1TB', 2499.00, 15, 'Dell', '2025-04-18 05:22:49', '2025-04-18 05:22:49'),
(10, 8, 'HPX360-BLACK-16GB-512GB', 1699.00, 12, 'HP', '2025-04-18 05:22:49', '2025-04-18 05:22:49'),
(11, 9, 'ROGG15-BLACK-32GB-1TB', 2199.00, 8, 'Asus', '2025-04-18 05:22:49', '2025-04-18 05:22:49'),
(12, 10, 'TPX1-BLACK-16GB-512GB', 1899.00, 10, 'Lenovo', '2025-04-18 05:22:49', '2025-04-18 05:22:49'),
(13, 1, 'IP15PM-TITANIUM-256GB', 30500000.00, 0, 'Apple', '2025-04-19 09:15:42', '2025-05-26 15:27:59'),
(15, 1, 'IP15PM-BLACK-512GB', 32500000.00, 10, 'Apple', '2025-04-19 09:16:28', '2025-05-26 15:28:03'),
(17, 12, 'WH1000XM5-BLACK-STD', 399.99, 20, 'Sony', '2025-04-19 12:26:39', '2025-04-19 12:26:39'),
(18, 12, 'WH1000XM5-BLACK-CASE', 429.99, 15, 'Sony', '2025-04-19 12:26:39', '2025-04-19 12:26:39'),
(19, 12, 'WH1000XM5-SILVER-STD', 399.99, 10, 'Sony', '2025-04-19 12:26:39', '2025-04-19 12:26:39'),
(20, 12, 'WH1000XM5-SILVER-CASE', 429.99, 12, 'Sony', '2025-04-19 12:26:39', '2025-04-19 12:26:39'),
(21, 11, 'AIRPODS-BLACK', 500000.00, 10, 'Apple', '2025-04-19 12:32:42', '2025-04-19 12:41:50'),
(22, 11, 'AIRPODS-SILVER', 5000.00, 10, 'Apple', '2025-04-19 12:43:22', '2025-04-19 12:43:22'),
(23, 13, 'HOCO_W21-BLACK', 100.00, 10, 'Hoco', '2025-04-19 14:25:05', '2025-04-19 14:25:34'),
(24, 13, 'HOCO_W21-SILVER', 110.00, 10, 'Hoco', '2025-04-19 14:25:05', '2025-04-19 14:25:34'),
(25, 15, 'AWIFI_CASE_H5-2-SILVER', 80.00, 10, 'Awifi', '2025-04-19 14:38:10', '2025-04-19 14:38:10'),
(26, 14, 'EARBUDS_KY9/KY8-SILVER', 80.00, 10, 'KY', '2025-04-19 14:38:10', '2025-04-19 14:38:10'),
(27, 16, 'BAGGY_JEANS-BLACK', 200.00, 15, 'UrbanFit', '2025-04-19 15:59:03', '2025-04-19 15:59:03'),
(28, 16, 'BAGGY_JEANS-BLUE', 180.00, 7, 'UrbanFit', '2025-04-19 15:59:03', '2025-04-19 15:59:03'),
(29, 17, 'PANTS-BLACK', 100.00, 13, 'ClassiqueStyle', '2025-04-19 15:59:03', '2025-04-19 15:59:03'),
(30, 17, 'PANTS-BLUE', 17.00, 90, 'ClassiqueStyle', '2025-04-19 15:59:03', '2025-04-19 15:59:03'),
(31, 18, 'SWEATPANTS-BLACK', 180.00, 30, 'ComfortWear', '2025-04-19 15:59:03', '2025-04-19 15:59:03'),
(32, 18, 'SWEATPANTS-SILVER', 12.00, 200, 'ComfortWear', '2025-04-19 15:59:03', '2025-04-19 15:59:03'),
(33, 19, 'JOGGER-BLACK', 160.00, 47, 'TrendyMove', '2025-04-19 15:59:03', '2025-04-19 15:59:03'),
(34, 19, 'JOGGER-SILVER', 160.00, 36, 'TrendyMove', '2025-04-19 15:59:03', '2025-04-19 15:59:03'),
(35, 20, 'JACKET-BLACK', 300.00, 53, 'Yazhiniao', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(36, 21, 'GILET-BLACK', 270.00, 34, 'KING', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(37, 21, 'GILET-RED', 270.00, 153, 'KING', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(38, 21, 'GILET-SPACE-GRAY', 270.00, 72, 'KING', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(39, 22, 'BLAZER-BLACK', 400.00, 342, 'VintageStyle', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(40, 22, 'BLAZER-SPACE-GRAY', 400.00, 233, 'VintageStyle', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(41, 23, 'TWO-LAYER-GILET-BLACK', 350.00, 434, 'VNXK', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(42, 22, 'BLAZER-BEIGE', 400.00, 342, 'VintageStyle', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(43, 23, 'TWO-LAYER-GILET-SPACE-GRAY', 350.00, 251, 'VNXK', '2025-04-19 16:22:52', '2025-04-19 16:22:52'),
(44, 24, 'TWO-STRAP-DRESS-BLACK', 100.00, 124, 'TABISHOP', '2025-04-19 16:39:35', '2025-04-19 16:39:35'),
(45, 24, 'TWO-STRAP-DRESS-RED', 100.00, 231, 'TABISHOP', '2025-04-19 16:39:35', '2025-04-19 16:39:35'),
(46, 24, 'TWO-STRAP-DRESS-BLUE', 100.00, 231, 'TABISHOP', '2025-04-19 16:39:35', '2025-04-19 16:39:35'),
(47, 24, 'TWO-STRAP-DRESS-BEIGE', 120.00, 231, 'TABISHOP', '2025-04-19 16:39:35', '2025-04-19 16:39:35'),
(48, 25, 'SHORT-FLARED-DRESS-BLACK', 200.00, 321, 'HANNSTYLE', '2025-04-19 16:39:35', '2025-04-19 16:39:35'),
(49, 25, 'SHORT-FLARED-DRESS-RED', 200.00, 321, 'HANNSTYLE', '2025-04-19 16:39:35', '2025-04-19 16:39:35'),
(50, 25, 'SHORT-FLARED-DRESS-BLUE', 200.00, 231, 'HANNSTYLE', '2025-04-19 16:39:35', '2025-04-19 16:39:35'),
(51, 25, 'SHORT-FLARED-DRESS-WHITE', 200.00, 231, 'HANNSTYLE', '2025-04-19 16:39:35', '2025-04-19 16:39:35'),
(52, 26, 'LAYERED-DRESS-BLACK', 200.00, 123, 'VM035', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(53, 26, 'LAYERED-DRESS-WHITE', 123.00, 123, 'VM035', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(54, 27, 'OFF-SHOULDER-BLACK', 123.00, 123, 'Elegance Couture', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(55, 27, 'OFF-SHOULDER-WHITE', 123.00, 123, 'Elegance Couture', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(56, 28, 'BLING-OFF-SHOULDER-BLACK', 123.00, 123, 'Chic Boutique', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(57, 28, 'BLING-OFF-SHOULDER-RED', 123.00, 123, 'Chic Boutique', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(58, 29, 'BODYCON-BLACK', 123.00, 123, '21ROOM', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(59, 29, 'BODYCON-WHITE', 123.00, 123, '21ROOM', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(62, 31, 'A-LINE-DRESS-BLACK', 123.00, 123, 'BEMINE', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(63, 31, 'A-LINE-DRESS-WHITE', 123.00, 123, 'BEMINE', '2025-04-19 17:33:03', '2025-04-19 17:33:03'),
(64, 41, 'CUP-NECK-TOP-BLACK', 100.00, 12, 'Oldschool', '2025-04-19 17:57:38', '2025-04-19 17:57:38'),
(65, 41, 'CUP-NECK-TOP-WHITE', 100.00, 21, 'Oldschool', '2025-04-19 17:57:38', '2025-04-19 17:57:38'),
(66, 42, 'SHORT-SLEEVE-GREEN', 200.00, 12, 'Vibrant Threads', '2025-04-19 17:57:38', '2025-04-19 17:57:38'),
(67, 43, 'BABY-TEE-BLACK', 150.00, 21, 'Miucho', '2025-04-19 17:57:38', '2025-04-19 17:57:38'),
(68, 43, 'BABY-TEE-WHITE', 150.00, 12, 'Miucho', '2025-04-19 17:57:38', '2025-04-19 17:57:38'),
(69, 43, 'BABY-TEE-BEIGE', 150.00, 15, 'Miucho', '2025-04-19 17:57:38', '2025-04-19 17:57:38'),
(70, 44, 'ROUND-NECK-BLACK', 100.00, 23, 'DAZZI', '0000-00-00 00:00:00', '2025-04-19 17:57:38'),
(71, 44, 'ROUND-NECK-BEIGE', 100.00, 23, 'DAZZI', '2025-04-19 17:57:38', '2025-04-19 17:57:38'),
(72, 44, 'ROUND-NECK-RED', 100.00, 21, 'DAZZI', '2025-04-19 17:57:38', '2025-04-19 17:57:38'),
(73, 46, 'MYCKCY-WATCH-BLACK', 1999.00, 32, ' McyKcy', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(74, 45, 'QUARTZ-WATCH-BLACK', 2000.00, 13, 'Elite Timepieces', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(75, 47, 'APPLE-WATCH-BLACK', 1700.00, 32, 'Apple', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(76, 47, 'APPLE-WATCH-BEIGE', 1700.00, 52, 'Apple', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(77, 48, 'WATERPROOF-SPACE-GRAY', 1500.00, 12, 'AquaTime', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(78, 49, 'QUARTZ-BELL-WATCH-BLACK', 1800.00, 32, 'Timeless Chic', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(79, 50, 'STRAP-WATCH-BLACK', 2800.00, 13, 'Steel Elegance', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(80, 51, 'HUB-BLACK', 1200.00, 12, 'HuB', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(81, 51, 'HUB-WHITE', 1200.00, 6, 'HuB', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(82, 52, 'MINIMALIST-BLACK', 1400.00, 10, 'Sleek Time', '2025-04-19 18:21:00', '2025-04-19 18:21:00'),
(83, 53, 'BOOKSHELF-TIER5', 100.00, 144, 'WoodCraft', '2025-04-20 08:18:56', '2025-04-20 08:18:56'),
(84, 53, 'BOOKSHELF-TIER3', 100.00, 144, 'WoodCraft', '2025-04-20 08:18:56', '2025-04-20 08:18:56'),
(85, 54, 'SHOE-RACK-TIER5', 100.00, 125, 'Forest Home', '2025-04-20 08:30:01', '2025-04-20 08:30:01'),
(86, 54, 'SHOE-RACK-TIER3', 100.00, 123, 'Forest Home', '2025-04-20 08:30:01', '2025-04-20 08:30:01'),
(87, 55, 'A29-BLACK', 100.00, 23, 'A29', '2025-04-20 08:37:36', '2025-04-20 08:37:36'),
(88, 55, 'A29-WHITE', 100.00, 23, 'A29', '2025-04-20 08:37:36', '2025-04-20 08:37:36'),
(89, 55, 'A29-SPACE-GRAY', 100.00, 23, 'A29', '2025-04-20 08:37:36', '2025-04-20 08:37:36'),
(90, 55, 'A29-BLUE', 100.00, 23, 'A29', '2025-04-20 08:37:36', '2025-04-20 08:37:36'),
(91, 56, 'LUNCH-BOX-BEIGE', 100.00, 23, 'SUNHOUSE', '2025-04-20 08:55:21', '2025-04-20 08:55:21'),
(92, 56, 'LUNCH-BOX-BLACK', 100.00, 43, 'SUNHOUSE', '2025-04-20 08:55:21', '2025-04-20 08:55:21'),
(96, 57, 'AIR-FRYER-PAPER-COMBO10', 10.00, 323, 'SUNHOUSE', '2025-04-20 08:59:12', '2025-04-20 08:59:12'),
(97, 57, 'AIR-FRYER-PAPER-COMBO30', 25.00, 123, 'SUNHOUSE', '2025-04-20 08:59:12', '2025-04-20 08:59:12'),
(98, 57, 'AIR-FRYER-PAPER-COMBO50', 0.00, 40, 'SUNHOUSE', '2025-04-20 08:59:12', '2025-04-20 08:59:12'),
(99, 58, 'PLASTIC-CONTAINER-100G', 10.00, 32, 'SUNHOUSE', '2025-04-20 09:06:58', '2025-04-20 09:06:58'),
(100, 58, 'PLASTIC-CONTAINER-200G', 10.00, 23, 'SUNHOUSE', '2025-04-20 09:06:58', '2025-04-20 09:06:58'),
(101, 58, 'PLASTIC-CONTAINER-250G', 10.00, 123, 'SUNHOUSE', '2025-04-20 09:06:58', '2025-04-20 09:06:58'),
(102, 58, 'PLASTIC-CONTAINER-300G', 10.00, 32, 'SUNHOUSE', '2025-04-20 09:06:58', '2025-04-20 09:06:58'),
(103, 58, 'PLASTIC-CONTAINER-400G', 10.00, 321, 'SUNHOUSE', '2025-04-20 09:06:58', '2025-04-20 09:06:58'),
(104, 58, 'PLASTIC-CONTAINER-500G', 10.00, 321, 'SUNHOUSE', '2025-04-20 09:06:58', '2025-04-20 09:06:58'),
(105, 58, 'PLASTIC-CONTAINER-750G', 10.00, 232, 'SUNHOUSE', '2025-04-20 09:06:58', '2025-04-20 09:06:58'),
(106, 58, 'PLASTIC-CONTAINER-1KG', 10.00, 232, 'SUNHOUSE', '2025-04-20 09:06:58', '2025-04-20 09:06:58'),
(110, 59, 'GLASS-LUNCH-BOX-COMPARTMENT2', 100.00, 42, 'SUNHOUSE', '2025-04-20 09:33:32', '2025-04-20 09:33:32'),
(111, 59, 'GLASS-LUNCH-BOX-COMPARTMENT3', 100.00, 32, 'SUNHOUSE', '2025-04-20 09:33:32', '2025-04-20 09:33:32'),
(112, 59, 'GLASS-LUNCH-BOX-COMPARTMENT4', 100.00, 32, 'SUNHOUSE', '2025-04-20 09:33:32', '2025-04-20 09:33:32');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recently_viewed`
--

CREATE TABLE `recently_viewed` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `viewed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `recently_viewed`
--

INSERT INTO `recently_viewed` (`id`, `user_id`, `product_id`, `viewed_at`) VALUES
(46, 7, 15, '2025-05-23 09:03:01'),
(56, 7, 12, '2025-05-25 00:15:38'),
(57, 7, 1, '2025-05-25 00:18:04'),
(61, 7, 11, '2025-05-26 16:19:43'),
(62, 7, 13, '2025-05-26 16:22:13'),
(67, 19, 41, '2025-07-06 07:30:33'),
(68, 1, 6, '2025-08-19 09:59:45'),
(69, 1, 1, '2025-08-27 05:16:11'),
(70, 1, 11, '2025-09-10 06:54:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sku_attributes`
--

CREATE TABLE `sku_attributes` (
  `sku_id` int NOT NULL,
  `attribute_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sku_attributes`
--

INSERT INTO `sku_attributes` (`sku_id`, `attribute_id`) VALUES
(1, 1),
(4, 1),
(6, 1),
(15, 1),
(21, 1),
(23, 1),
(27, 1),
(29, 1),
(31, 1),
(33, 1),
(35, 1),
(36, 1),
(39, 1),
(41, 1),
(44, 1),
(48, 1),
(52, 1),
(54, 1),
(56, 1),
(58, 1),
(62, 1),
(64, 1),
(67, 1),
(70, 1),
(73, 1),
(87, 1),
(92, 1),
(7, 2),
(22, 2),
(24, 2),
(25, 2),
(26, 2),
(32, 2),
(34, 2),
(5, 3),
(28, 3),
(30, 3),
(46, 3),
(50, 3),
(90, 3),
(3, 4),
(66, 4),
(2, 5),
(13, 5),
(5, 6),
(1, 7),
(3, 7),
(6, 7),
(13, 7),
(2, 8),
(4, 8),
(7, 8),
(15, 8),
(8, 10),
(38, 10),
(40, 10),
(43, 10),
(89, 10),
(9, 11),
(10, 12),
(11, 12),
(12, 12),
(10, 13),
(12, 13),
(8, 14),
(9, 14),
(11, 14),
(10, 15),
(12, 15),
(8, 16),
(9, 16),
(11, 16),
(42, 21),
(47, 21),
(69, 21),
(71, 21),
(91, 21),
(37, 22),
(45, 22),
(49, 22),
(57, 22),
(72, 22),
(51, 24),
(53, 24),
(55, 24),
(59, 24),
(63, 24),
(65, 24),
(68, 24),
(88, 24),
(84, 25),
(86, 25),
(83, 26),
(85, 26),
(96, 27),
(97, 28),
(98, 29),
(99, 30),
(100, 31),
(101, 32),
(102, 33),
(103, 34),
(104, 35),
(105, 36),
(106, 37),
(110, 38),
(111, 39),
(112, 40);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `submission_tracking`
--

CREATE TABLE `submission_tracking` (
  `id` int NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `submission_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `submission_tracking`
--

INSERT INTO `submission_tracking` (`id`, `ip_address`, `submission_time`) VALUES
(1, '::1', '2025-05-14 09:15:52'),
(2, '::1', '2025-05-14 09:16:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` int NOT NULL,
  `parent_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sub_categories`
--

INSERT INTO `sub_categories` (`id`, `parent_id`, `name`, `description`, `image`, `active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Smartphones', 'Latest iOS and Android phones', '/images/sub-categories/smartphones.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(2, 1, 'Laptops', 'Personal, business, and gaming laptops', '/images/sub-categories/laptops.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(3, 1, 'Headphones', 'Wireless, noise-cancelling, earbuds', '/images/sub-categories/headphones.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(4, 2, 'Men\'s Clothing', 'T-Shirts, jeans, jackets, and more', '/images/sub-categories/mens_clothing.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(5, 2, 'Women\'s Clothing', 'Dresses, tops, skirts, and more', '/images/sub-categories/womens_clothing.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(6, 2, 'Accessories', 'Watches, bags, jewelry', '/images/sub-categories/fashion_accessories.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(7, 3, 'Furniture', 'Sofas, tables, beds, and chairs', '/images/sub-categories/furniture.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(8, 3, 'Kitchen & Dining', 'Cookware, appliances, and tools', '/images/sub-categories/kitchen_dining.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(9, 3, 'Home Decor', 'Wall art, lighting, and accents', '/images/sub-categories/home_decor.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(10, 4, 'Makeup', 'Foundations, lipsticks, palettes', '/images/sub-categories/makeup.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(11, 4, 'Skincare', 'Cleansers, serums, moisturizers', '/images/sub-categories/skincare.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(12, 4, 'Hair Care', 'Shampoos, conditioners, treatments', '/images/sub-categories/haircare.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(13, 5, 'Exercise Equipment', 'Treadmills, weights, resistance bands', '/images/sub-categories/exercise_equipment.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(14, 5, 'Outdoor Gear', 'Camping, hiking, and biking gear', '/images/sub-categories/outdoor_gear.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(15, 5, 'Sports Apparel', 'Clothing and shoes for training', '/images/sub-categories/sports_apparel.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(16, 6, 'Educational Toys', 'STEM kits, learning games', '/images/sub-categories/educational_toys.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(17, 6, 'Board Games', 'Strategy and family board games', '/images/sub-categories/board_games.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(18, 6, 'Action Figures', 'Superheroes, movie characters', '/images/sub-categories/action_figures.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(19, 7, 'Fiction', 'Novels, sci-fi, and fantasy books', '/images/sub-categories/fiction.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(20, 7, 'Non-fiction', 'Biographies, self-help, history', '/images/sub-categories/non_fiction.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(21, 7, 'Stationery', 'Notebooks, pens, and planners', '/images/sub-categories/stationery.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(22, 8, 'Car Accessories', 'Phone holders, organizers, mats', '/images/sub-categories/car_accessories.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(23, 8, 'Maintenance Tools', 'Jacks, pumps, and kits', '/images/sub-categories/maintenance_tools.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(24, 8, 'Motorcycle Gear', 'Helmets, jackets, gloves', '/images/sub-categories/motorcycle_gear.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(25, 9, 'Beverages', 'Soft drinks, juices, tea & coffee', '/images/sub-categories/beverages.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(26, 9, 'Snacks', 'Chips, chocolates, dry fruits', '/images/sub-categories/snacks.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(27, 9, 'Household Essentials', 'Cleaning and daily-use items', '/images/sub-categories/household_essentials.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(28, 10, 'Pet Food', 'Dry and wet food for cats & dogs', '/images/sub-categories/pet_food.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(29, 10, 'Toys & Treats', 'Chew toys, bones, and snacks', '/images/sub-categories/pet_toys.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54'),
(30, 10, 'Grooming & Care', 'Shampoo, brushes, grooming kits', '/images/sub-categories/pet_grooming.jpg', 1, '2025-04-18 04:07:24', '2025-04-18 04:27:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birth` date DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `avatar`, `name`, `username`, `email`, `password`, `birth`, `phone_number`, `is_verified`, `role`, `verified_at`, `created_at`) VALUES
(1, 'images/avatars/1_1751557568_share-poster-1749998037227.jpg', 'Tai The Phung', 'taiphung143', 'taiphung143@gmail.com', '$2y$12$nABXTUHDb.J8fOt8g7yAs.M8pMGkYb9beSlt0YLekS9HwDhdnMNXK', '2005-03-14', '0335526427', 1, 'admin', '2025-04-17 17:41:18', '2025-04-17 17:39:11'),
(7, 'images/avatars/7_1748276672_doge.jpg', 'buithai son', 'buithaison', 'bts18062005@gmail.com', '$2y$12$.YD6Rfovsl6I6/a/Nh2ngegSDDZmP74y21lJSYfjB9dg0l87g04r2', '0000-00-00', '', 1, 'admin', '2025-04-20 12:56:39', '2025-04-20 12:56:17'),
(16, '', 'The Taii Phung222', 'uhuwfmi223', 'phungtai143@gmail.com', '$2y$12$gCccRyDA1PPq11Ks0wmqKudyZXTw5K3nNr2Nf/6myDFZ1kh7v6Kiu', '0000-00-00', '', 1, 'user', NULL, '2025-05-24 14:23:56'),
(19, 'images/avatars/19_1751787058_Ảnh màn hình 2025-06-21 lúc 11.24.40.png', 'The Tai', 'taiphungshopee1', 'taiphungshopee1@gmail.com', '$2y$12$Te6WlxlxTPjxwOSIBpoiWew7XzgKbn7RZbD.YUzoZX27snkjBsgxS', '2025-05-15', '0123456789', 1, 'user', '2025-05-26 15:51:53', '2025-05-26 15:51:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_tokens`
--

CREATE TABLE `user_tokens` (
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user_tokens`
--

INSERT INTO `user_tokens` (`user_id`, `token`, `is_used`, `created_at`, `expires_at`) VALUES
(1, '8284b8a2b61cc5e3c7124bb8c86ff94e', 1, '2025-04-17 17:39:12', '2025-04-18 17:39:12'),
(7, '445eaa81e06d9b297e4978ac89dba60d', 1, '2025-04-20 12:56:17', '2025-04-21 12:56:17'),
(16, '023e8a8bd7cdf80c3fc4f51dcf038e91', 0, '2025-05-24 14:23:56', '2025-05-25 14:23:56'),
(19, '20e3c5e74a0c70b0c417b54dc2242a48', 1, '2025-05-26 15:51:26', '2025-05-27 15:51:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int NOT NULL,
  `code` varchar(100) NOT NULL,
  `discount_percent` int NOT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `discount_percent`, `start_at`, `end_at`, `created_at`, `updated_at`) VALUES
(9, 'SHOP10', 10, '2025-05-26 00:00:00', '2025-06-25 00:00:00', '2025-05-26 15:20:36', '2025-05-26 15:20:36'),
(13, 'SGYL58', 99, '2025-07-06 00:00:00', '2025-08-05 00:00:00', '2025-07-06 07:33:04', '2025-07-06 07:33:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `product_id`, `added_at`) VALUES
(28, 7, 14, '2025-05-22 17:49:11'),
(30, 7, 13, '2025-05-22 18:14:56'),
(31, 1, 12, '2025-05-23 04:51:28'),
(33, 7, 15, '2025-05-23 09:03:08'),
(36, 19, 1, '2025-05-26 15:53:13'),
(39, 1, 1, '2025-08-27 05:16:33');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_sku_id` (`product_sku_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `shipping_address_id` (`shipping_address_id`);

--
-- Chỉ mục cho bảng `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_sku_id` (`product_sku_id`);

--
-- Chỉ mục cho bảng `payment_details`
--
ALTER TABLE `payment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `fk_sub_category` (`sub_category_id`);

--
-- Chỉ mục cho bảng `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `product_discounts`
--
ALTER TABLE `product_discounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product` (`product_id`);

--
-- Chỉ mục cho bảng `product_skus`
--
ALTER TABLE `product_skus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `recently_viewed`
--
ALTER TABLE `recently_viewed`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_view` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `sku_attributes`
--
ALTER TABLE `sku_attributes`
  ADD PRIMARY KEY (`sku_id`,`attribute_id`),
  ADD KEY `attribute_id` (`attribute_id`);

--
-- Chỉ mục cho bảng `submission_tracking`
--
ALTER TABLE `submission_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip_time` (`ip_address`,`submission_time`);

--
-- Chỉ mục cho bảng `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD PRIMARY KEY (`user_id`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_wishlist` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT cho bảng `payment_details`
--
ALTER TABLE `payment_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT cho bảng `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `product_discounts`
--
ALTER TABLE `product_discounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `product_skus`
--
ALTER TABLE `product_skus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT cho bảng `recently_viewed`
--
ALTER TABLE `recently_viewed`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT cho bảng `submission_tracking`
--
ALTER TABLE `submission_tracking`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`product_sku_id`) REFERENCES `product_skus` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`product_sku_id`) REFERENCES `product_skus` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `payment_details`
--
ALTER TABLE `payment_details`
  ADD CONSTRAINT `payment_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_sub_category` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `sub_categories` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `product_discounts`
--
ALTER TABLE `product_discounts`
  ADD CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `product_skus`
--
ALTER TABLE `product_skus`
  ADD CONSTRAINT `product_skus_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `recently_viewed`
--
ALTER TABLE `recently_viewed`
  ADD CONSTRAINT `recently_viewed_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recently_viewed_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `sku_attributes`
--
ALTER TABLE `sku_attributes`
  ADD CONSTRAINT `sku_attributes_ibfk_1` FOREIGN KEY (`sku_id`) REFERENCES `product_skus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sku_attributes_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
