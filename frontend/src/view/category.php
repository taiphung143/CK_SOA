<?php
$page = 'category';
include("header.php");

// Include required files for database and model
require_once(__DIR__ . '/../dao/pdo.php');
require_once(__DIR__ . '/../model/CategoryModel.php');
require_once(__DIR__ . '/../model/product.php');


$pdo = connectPDO();
$categoryModel = new CategoryModel($pdo);
$productModel = new ProductModel($pdo);

// Get all active categories
$id = $_GET['id'] ?? '1';
$sub_id = $_GET['sub_id'] ?? null;
$sub_categories = $categoryModel->getSubCategories($id);

// Get the current category name
$current_category = $categoryModel->getCategoryById($id);
$category_name = $current_category ? $current_category['name'] : 'All Categories';

// Get products for this category or its subcategories
$products = [];
$is_subcategory = false;
$subcategory = $categoryModel->getSubCategoryById($id);

if ($sub_id != null) {
    // This is a subcategory
    $is_subcategory = true;
    $products = $productModel->getAllProductsBySubCategories(null, $id, $sub_id);
    
} else {
    
    // This is a main category, get products from subcategories
    $products = $productModel->getAllProducts(null, $id);
    
}
?>
<div class="container">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
        <a href="index.php">Home</a>
        <span>/</span>
        <a href="category.php">Category</a>
        <span>/</span>
        <span class="current"><?php echo htmlspecialchars($category_name); ?></span>
    </div>
</div>
<div class="banner-top">
    <div class="row container bg-white rounded-4">
        <p class="heading-top-cell">TOP CELL PHONES &amp; TABLETS</p>
        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 p-0 m-0">
            <div class="swiper mySwiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <img class="img-fluid" src="../images/logo.jpeg" alt="">
                        <p class="group-heading">
                            <span class="text-wrapper">Noise Cancelling<br /></span> <span class="span">Headphone</span>
                        </p>
                        <div class="detail-1">Boso Over-ear Headphone, Wifi, Voice Assistant, Low Latency Game Mode
                        </div>
                        <div class="btn-1">
                            <button class="buy-now">BUY NOW</button>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <img class="img-fluid" src="../images/logo.jpeg" alt="">
                        <p class="group-heading">
                            <span class="text-wrapper">Noise Cancelling<br /></span> <span class="span">Headphone</span>
                        </p>
                        <div class="detail-1">Boso Over-ear Headphone, Wifi, Voice Assistant, Low Latency Game Mode
                        </div>
                        <div class="btn-1">
                            <button class="buy-now">BUY NOW</button>
                        </div>
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 p-0 m-0 d-flex justify-content-center align-items-center">
            <div class="left-col">
                <img src="../images/logo.jpeg" alt="" class="img-fluid w-100 border-img">
                <div class="group-heading">
                    <span class="text-wrapper">redmi note 12 Pro+ 5g</span>
                </div>
                <div class="detail-2">
                    Rise to the challenge
                </div>
                <div class="btn-2">
                    <button class="buy-now">SHOP NOW</button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="categories">
    <div class="container bg-white rounded-4">
        <div class="category-bar">
            <p class="heading-top-cell">POPULAR CATEGORIES IN <?php echo strtoupper(htmlspecialchars($category_name)); ?></p>
            <!-- Category item -->
            <div class="scroll-wrapper">
                <?php 
                // Get icon based on subcategory name
                function getIconForCategory($name) {
                    $name = strtolower($name);
                    $icons = [
                        'gaming' => 'controller',
                        'sport' => 'exercise-bike',
                        'kitchen' => 'coffee-maker',
                        'headphones' => 'headphones',
                        'cleaner' => 'robot-vacuum',
                        'mobile' => 'iphone',
                        'phone' => 'iphone',
                        'office' => 'printer',
                        'camera' => 'camera',
                        'computer' => 'laptop',
                        'laptop' => 'laptop',
                        'tv' => 'tv',
                        'television' => 'tv',
                        'audio' => 'speaker',
                        'speaker' => 'speaker',
                        'accessories' => 'shopping-bag',
                        "women's clothing" => 'womens-suit',
                        "men's clothing" => 'suit',
                        'furniture' => 'furniture',
                        "home decor" => 'foreclosure',
                        "hair care" => 'hair-dryer',
                        'makeup' => 'mascara',
                        'skincare' => 'spa-mask',
                        
                        
                    ];
                    
                    foreach ($icons as $keyword => $icon) {
                        if (strpos($name, $keyword) !== false) {
                            return $icon;
                        }
                    }
                    
                    // Default icon if no match
                    return 'box';
                }
                
                // Display subcategories dynamically
                if (!empty($sub_categories)) {
                    foreach ($sub_categories as $subcat) {
                        $icon = getIconForCategory($subcat['name']);
                ?>                <div class="col-auto category-item">
                    <a href="index.php?page=category&id=<?php echo $id?>&sub_id=<?php echo $subcat['id']; ?>">
                        <div class="category-icon">
                            <img src="https://img.icons8.com/ios-filled/50/000000/<?php echo $icon; ?>.png" alt="<?php echo htmlspecialchars($subcat['name']); ?>">
                        </div>
                        <div class="category-name"><?php echo htmlspecialchars($subcat['name']); ?></div>
                    </a>
                </div>
                <?php 
                    }
                } else {
                    // If no subcategories, show a message or get all categories
                    $all_categories = $categoryModel->getAllCategories();
                    foreach ($all_categories as $cat) {
                        $icon = getIconForCategory($cat['name']);
                ?>
                <div class="col-auto category-item">
                    <a href="category.php?id=<?php echo $cat['id']; ?>">
                        <div class="category-icon">
                            <img src="https://img.icons8.com/ios-filled/50/000000/<?php echo $icon; ?>.png" alt="<?php echo htmlspecialchars($cat['name']); ?>">
                        </div>
                        <div class="category-name"><?php echo htmlspecialchars($cat['name']); ?></div>
                    </a>
                </div>
                <?php
                    }
                }
                ?>
            </div>
        </div>
    </div>
</div>
<div class="main">
    <div class="row container bg-white rounded-4">
        <div class="col-6 col-lg-3 col-md-4 col-sm-6">
            <div class="menu">
                <div class="top">
                    <p class="heading-top-cell">CATEGORIES</p>
                    <a href="" class="small">Reset All</a>
                </div>
                <div class="row">
                    <div class="col-5 p-0">
                        <input type="text" name="min" id="min" class="border-0 form-control w-100 mb-2"
                            placeholder="Min:">
                        <input type="text" name="color" id="color" class="border-0 form-control w-100 mb-2"
                            placeholder="Color">
                    </div>
                    <div class="col-5 p-0">
                        <input type="text" name="size" id="size" class="border-0 form-control w-100 mb-2">
                        <input type="text" name="memory" id="mamory" class="border-0 form-control w-100 mb-2">
                    </div>
                </div>
                <div class="brand">
                    <p class="fw-bold fs-6">By Brands</p>
                    <input type="text" name="brand" id="text-id" class="border-0 form-control mb-4">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="brand" value="msi" id="msi1">
                        <label for="msi1" class="mb-0">msi</label>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="brand" value="msi2" id="msi2">
                        <label for="msi2" class="mb-0">msi</label>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="brand" value="msi3" id="msi3">
                        <label for="msi3" class="mb-0">msi</label>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="brand" value="msi4" id="msi4">
                        <label for="msi4" class="mb-0">msi</label>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="brand" value="msi5" id="msi5">
                        <label for="msi5" class="mb-0">msi</label>
                    </div>
                </div>
                <div class="price">
                    <p class="fw-bold fs-6">By Price</p>
                    <div class="range-slider">
                        <div class="range-fill" id="rangeFill"></div>
                        <input type="range" min="0" max="10000" value="0" id="minPrice" oninput="updatePrice()">
                        <input type="range" min="0" max="10000" value="10000" id="maxPrice" oninput="updatePrice()">
                    </div>
                    <div class="range-values gap-2">
                        <span class="mx-2">from</span>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="text" class="form-control" id="minPriceValue" value="0" readonly>
                        </div>
                        <span class="mx-2">to</span>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="text" class="form-control" id="maxPriceValue" value="10000" readonly>
                        </div>
                        <button class="btn btn-success ms-3 mx-auto" onclick="applyPriceFilter()">Go</button>
                    </div>
                </div>
                <div class="rate">
                    <p class="fw-bold fs-6">By Rate</p>
                    <input type="text" name="reviewCount" id="text-id" class="border-0 form-control w-100 mb-4"
                        placeholder="Nhập số đánh giá">

                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="reviewCount" value="500" id="review500">
                        <label for="review500" class="mb-0">Từ 500+ đánh giá</label>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="reviewCount" value="1000" id="review1000">
                        <label for="review1000" class="mb-0">Từ 1000+ đánh giá</label>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="reviewCount" value="2000" id="review2000">
                        <label for="review2000" class="mb-0">Từ 2000+ đánh giá</label>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="reviewCount" value="3000" id="review3000">
                        <label for="review3000" class="mb-0">Từ 3000+ đánh giá</label>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="radio" class="square-radio" name="reviewCount" value="5000" id="review5000">
                        <label for="review5000" class="mb-0">Từ 5000+ đánh giá</label>
                    </div>
                </div>
                <div class="size">
                    <p class="fw-bold fs-6">By Screen Size</p>
                    <div class="group-link">
                        <a href="" class="link">4.5 inch</a>
                        <a href="" class="link">5.0 inch</a>
                        <a href="" class="link">5.5 inch</a>
                        <a href="" class="link">6.0 inch</a>
                        <a href="" class="link">6.5 inch</a>
                    </div>
                </div>
                <div class="color">
                    <p class="fw-bold fs-6">By Color</p>
                    <div class="group-items">
                        <button class="color-item"></button>
                        <button class="color-item"></button>
                        <button class="color-item"></button>
                        <button class="color-item"></button>
                        <button class="color-item"></button>
                        <button class="color-item"></button>
                        <button class="color-item"></button>
                        <button class="color-item"></button>
                    </div>
                </div>
                <div class="memory">
                    <p class="fw-bold fs-6">By Memory</p>
                    <div class="group-memory">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <input type="radio" class="square-radio" name="memory" value="500" id="32GB">
                            <label for="32GB" class="mb-0">32GB</label>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <input type="radio" class="square-radio" name="memory" value="1000" id="64GB">
                            <label for="64GB" class="mb-0">32GB</label>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <input type="radio" class="square-radio" name="memory" value="2000" id="128GB">
                            <label for="128GB" class="mb-0">32G</label>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <input type="radio" class="square-radio" name="memory" value="3000" id="256GB">
                            <label for="256GB" class="mb-0">32GB</label>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <input type="radio" class="square-radio" name="memory" value="5000" id="512GB">
                            <label for="512GB" class="mb-0">32GB</label>
                        </div>
                    </div>
                </div>
                <div class="condition">
                    <p class="fw-bold fs-6">By Conditions</p>
                    <div class="group-condition">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <input type="radio" class="square-radio" name="condition" value="2000" id="new">
                            <label for="new" class="mb-0">New</label>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <input type="radio" class="square-radio" name="condition" value="3000" id="like-new">
                            <label for="like-new" class="mb-0">Like New</label>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <input type="radio" class="square-radio" name="condition" value="5000" id="open-box">
                            <label for="open-box" class="mb-0">Open Box</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-lg-9 col-md-8 col-sm-6">
            <div class="product-list p-2">
                <p class="fw-bold fs-4">Best seller in this category</p>
                <div id="carouselExampleFade" class="carousel slide carousel-fade d-none d-sm-block">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <div class="row">
                                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 gap-2 d-none d-lg-block ">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <div class="row">
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div class="card">
                                        <img src="../images/vnpay.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-4 gap-2 d-none d-lg-block">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <div class="row">
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div class="card">
                                        <img src="../images/momo.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-4 col-sm-6 mb-4 gap-2 d-none d-lg-block">
                                    <div class="card">
                                        <img src="../images/visa.png" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <a href="#">
                                                <h5 class="card-title">Card title</h5>
                                            </a>
                                            <p class="card-text">Some quick example text to build on the card title and
                                                make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev custom-carousel-btn" type="button"
                        data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                        <i class="bi bi-caret-left-fill fs-1"></i>
                    </button>
                    <button class="carousel-control-next custom-carousel-btn" type="button"
                        data-bs-target="#carouselExampleFade" data-bs-slide="next">
                        <i class="bi bi-caret-right-fill fs-1"></i>
                    </button>
                </div>
                <div class="mobile-scroll d-block d-sm-none">
                    <div class="d-flex overflow-auto gap-3 py-2">
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text to build on the card title and
                                    make up the bulk of the card's content.</p>
                            </div>
                        </div>
                        <!-- lặp thêm card nữa -->
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <div class="card me-2">
                            <img src="../images/visa.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <a href="#">
                                    <h5 class="card-title">Card title</h5>
                                </a>
                                <p class="card-text">Some quick example text...</p>
                            </div>
                        </div>
                        <!-- thêm bao nhiêu card tùy bạn -->
                    </div>
                </div>
                <div class="d-flex justify-content-end d-lg-none mb-3">
                    <button class="btn btn-outline-secondary" data-bs-toggle="offcanvas"
                        data-bs-target="#mobileSettings">
                        <i class="bi bi-list fs-4"></i>
                    </button>
                </div>
                <div class="setting d-none d-lg-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <a href="#">1-40 of 120</a>
                    <div class="show-item">
                        <p>Show item</p>
                        <div class="show-number">
                            <a href="#">16</a>
                            <a href="#">24</a>
                            <a href="#">32</a>
                            <a href="#">40</a>
                        </div>
                    </div>
                    <div class="show-item">
                        <p>Show item</p>
                        <div class="dropdown">
                            <button class="btn btn-outline-secondary dropdown-toggle" type="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Default
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Default</a></li>
                                <li><a class="dropdown-item" href="#">Price: Low to High</a></li>
                                <li><a class="dropdown-item" href="#">Price: High to Low</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="view">
                        <p>View as</p>
                        <button class="btn bg-secondary rounded-circle d-flex justify-content-center align-items-center"
                            style="width: 30px; height: 30px;">
                            <i class="bi bi-list-ul"></i> <!-- Dùng Bootstrap Icon -->
                        </button>
                        <button class="btn bg-secondary rounded-circle d-flex justify-content-center align-items-center"
                            style="width: 30px; height: 30px;">
                            <i class="bi bi-grid-fill"></i> <!-- Dùng Bootstrap Icon -->
                        </button>
                    </div>
                </div>
                <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileSettings">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title">Settings</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div class="offcanvas-body d-flex flex-column gap-3">

                        <a href="#">1-40 of 120</a>

                        <div class="show-item">
                            <p>Show item</p>
                            <div class="show-number d-flex gap-2 flex-wrap">
                                <a href="#">16</a>
                                <a href="#">24</a>
                                <a href="#">32</a>
                                <a href="#">40</a>
                            </div>
                        </div>

                        <div class="show-item">
                            <p>Sort by</p>
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button"
                                    data-bs-toggle="dropdown">
                                    Default
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Default</a></li>
                                    <li><a class="dropdown-item" href="#">Price: Low to High</a></li>
                                    <li><a class="dropdown-item" href="#">Price: High to Low</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="view d-flex align-items-center gap-2">
                            <p class="mb-0">View as</p>
                            <button
                                class="btn bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white"
                                style="width: 30px; height: 30px;">
                                <i class="bi bi-list-ul"></i>
                            </button>
                            <button
                                class="btn bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white"
                                style="width: 30px; height: 30px;">
                                <i class="bi bi-grid-fill"></i>
                            </button>
                        </div>

                    </div>
                </div>                <div class="product-view">
                    <?php if (empty($products)): ?>
                        <div class="alert alert-info w-100" role="alert">
                            No products found in this category.
                        </div>
                    <?php else: ?>
                        <?php foreach ($products as $product): ?>
                            <div class="card">
                                <button class="btn wishlist-btn" data-product-id="<?php echo $product['id']; ?>" style="width: 30px; height: 30px;">
                                    <i class="bi bi-heart"></i> <!-- Default empty heart -->
                                </button>
                                <img src="<?php echo !empty($product['image_thumbnail']) ? htmlspecialchars($product['image_thumbnail']) : '../images/product-image.png'; ?>" class="card-img-top" alt="<?php echo htmlspecialchars($product['name']); ?>">
                                <div class="card-body">
                                    <a href="index.php?page=product&id=<?php echo $product['id']; ?>">
                                        <h5 class="card-title"><?php echo htmlspecialchars($product['name']); ?></h5>
                                    </a>
                                    <div class="product-price">
                                        <?php if (isset($product['has_discount']) && $product['has_discount']): ?>
                                            <?php if ($product['min_price'] == $product['max_price']): ?>
                                                <p class="price discounted-price">
                                                    <?php echo number_format($product['min_price'], 0, ',', '.'); ?>₫
                                                    <span class="original-price"><?php echo number_format($product['original_min_price'], 0, ',', '.'); ?>₫</span>
                                                    <span class="discount-badge">-<?php echo $product['discount_percent']; ?>%</span>
                                                </p>
                                            <?php else: ?>
                                                <p class="price discounted-price">
                                                    <?php echo number_format($product['min_price'], 0, ',', '.'); ?>₫ - <?php echo number_format($product['max_price'], 0, ',', '.'); ?>₫
                                                    <span class="original-price"><?php echo number_format($product['original_min_price'], 0, ',', '.'); ?>₫ - <?php echo number_format($product['original_max_price'], 0, ',', '.'); ?>₫</span>
                                                    <span class="discount-badge">-<?php echo $product['discount_percent']; ?>%</span>
                                                </p>
                                            <?php endif; ?>
                                        <?php else: ?>
                                            <?php if ($product['min_price'] == $product['max_price']): ?>
                                                <p class="price"><?php echo number_format($product['min_price'], 0, ',', '.'); ?>₫</p>
                                            <?php else: ?>
                                                <p class="price"><?php echo number_format($product['min_price'], 0, ',', '.'); ?>₫ - <?php echo number_format($product['max_price'], 0, ',', '.'); ?>₫</p>
                                            <?php endif; ?>
                                        <?php endif; ?>
                                    </div>
                                    <p class="card-text"><?php echo htmlspecialchars(substr($product['description'], 0, 100)); ?><?php echo strlen($product['description']) > 100 ? '...' : ''; ?></p>
                                    <a href="index.php?page=product&id=<?php echo $product['id']; ?>" class="btn btn-primary mt-2">View Details</a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex justify-content-center mt-4 mb-5">
        <nav aria-label="Product pagination">
            <ul class="pagination">
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">4</a></li>
                <li class="page-item"><a class="page-link" href="#">5</a></li>
                <li class="page-item"><a class="page-link" href="#">6</a></li>
                <li class="page-item"><a class="page-link" href="#">7</a></li>
                <li class="page-item"><a class="page-link" href="#">8</a></li>
                <li class="page-item"><a class="page-link" href="#">9</a></li>
                <li class="page-item"><a class="page-link" href="#">10</a></li>
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>
<?php
include("footer.php");
?>