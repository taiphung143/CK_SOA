

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="images/logo.ico" type="image/vnd.microsoft.icon" />
    <title>Shop365</title>
    <meta name="google-site-verification" content="tDS8MIG6oCwslY8OXLUZZSKVTLOUUWr42wi4_yQUouk" />
    <!-- CSS chung -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="css/globals.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/form-messages.css">

    <!-- CSS riêng cho từng trang -->
    <?php if (isset($page) && $page == 'login'): ?>
        <link rel="stylesheet" href="css/login.css">
        <title>Shop365 - Login</title>
        <meta name="description" content="Đăng nhập để mua sắm cùng với Shop365 ngay hôm nay!" />
        <meta name="keywords" content="Shop365" />
    <?php endif; ?>

    <?php if (isset($page) && $page == 'register'): ?>
        <link rel="stylesheet" href="css/register.css">
        <title>Shop365 - Register</title>
    <?php endif; ?>

    <?php if (isset($page) && $page == 'contact'): ?>
        <link rel="stylesheet" href="css/contact.css">
        <title>Shop365 - Contact</title>
    <?php endif; ?>

    <?php if ($page === 'about'): ?>
        <link rel="stylesheet" href="css/about.css">
        <title>Shop365 - About</title>
    <?php endif; ?>

    <?php if ($page === 'category'): ?>
        <link rel="stylesheet" href="css/category.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <title>Shop365 - Category</title>
        <?php endif; ?>
    <?php if ($page === 'profile'): ?>
        <link rel="stylesheet" href="css/profile.css">
        <title>Shop365 - Profile</title>
    <?php endif; ?>

    <?php if ($page === 'checkout'): ?>
        <link rel="stylesheet" href="css/checkout.css">
        <title>Shop365 - Checkout</title>
    <?php endif; ?>
    
    <?php if ($page === 'cart'): ?>
        <link rel="stylesheet" href="css/cart.css">
        <title>Shop365 - Cart</title>
    <?php endif; ?>

    <?php if ($page === 'product'): ?>
        <link rel="stylesheet" href="css/product.css">
        <title>Shop365 - Product</title>
    <?php endif; ?>

    <?php if (isset($page) && $page == 'home'): ?>
        <link rel="stylesheet" href="css/home.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <title>Shop365 - Home</title>
    <?php endif; ?>

    <link rel="stylesheet" href="css/footer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
</head>

<body>
    <!-- Top Notification Bar -->
    <?php if (!isset($_SESSION['user'])): ?>
        <!-- Top Notification Bar -->
        <div class="top-notification">
            <div class="container">
                <span class="special-badge">Special</span>
                <span class="discount-text">Get 10% Discount for first order</span>
                <a href="index.php?page=register" class="register-link">Register Now</a>
            </div>
        </div>
    <?php endif; ?>

    <!-- Top Navigation Bar -->
    <div class="top-navbar">
        <div class="container">
            <div class="top-navbar-content">
                <div class="left-links">
                    <a href="#" class="nav-link"><i class="fas fa-store"></i> Sell on Shop365</a>
                </div>
                <div class="center-text">
                    <span>Shopping anytime, anywhere</span>
                </div>
                <div class="right-links">
                    <a href="#" class="nav-link"><i class="fas fa-history"></i> Recently Viewed</a>                
                    <?php if (isset($_SESSION['user'])): ?>
                    <a href="index.php?page=profile" class="nav-link">👋 Xin chào, <?= htmlspecialchars($_SESSION['user']['email']) ?></a>
                    <a href="index.php?page=logout" class="nav-link">Logout</a>
                <?php else: ?>
                    <a href="index.php?page=login" class="nav-link">Login</a>
                    <a href="index.php?page=register" class="nav-link">Register</a>
                <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="main-navbar">
        <div class="container">
            <div class="main-navbar-content">
                <div class="logo">
                    <a href="index.php"><img src="images/logo-modified.png" alt="Shop365 Logo"></a>

                </div>
                <div class="hotline">
                    <div class="icon-circle">
                        <i class="fas fa-phone-alt"></i>
                    </div>
                    <div class="hotline-text">
                        <small>Hotline 24/7</small>
                        <h6>(012) 3456 789</h6>
                    </div>
                </div>
                <div class="search-bar">
                    <input type="text" class="input" placeholder="Search anything...">
                    <button class="search-button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="icons">
                    <i class="fas fa-heart"></i>
                    <a href="index.php?page=cart" class="cart">
                        <i class="fas fa-shopping-cart"></i>
                        <div class="cart-count">2</div>
                    </a>
                </div>
                <div class="message-icon">
                    <i class="far fa-comment-alt"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Categories Navigation -->
    <div class="categories-navbar">
        <div class="container">
            <div class="categories-navbar-content">
                <div class="mobile-menu-toggle">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="categories-button">
                    <span>categories</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="nav-links">
                    <a href="index.php" class="nav-link">Home</a>
                    <a href="index.php?page=voucher" class="nav-link">Voucher</a>
                    <a href="index.php?page=contact" class="nav-link">Contact</a>
                    <a href="index.php?page=about" class="nav-link">About</a>
                    <a href="index.php?page=track" class="nav-link">Track Order</a>
                </div>
                <div class="language-currency">
                    <div class="currency-selector">
                        <i class="fas fa-dollar-sign"></i>
                        <span>USD</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="language-selector">
                        <i class="fas fa-flag"></i>
                        <span>Eng</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>