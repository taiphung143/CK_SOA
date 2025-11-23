<?php
$page = 'home';
include('header.php'); // Thay đường dẫn nếu cần

// Include required files for database and model
require_once(__DIR__ . '/../dao/pdo.php');
require_once(__DIR__ . '/../model/CategoryModel.php');

// Establish database connection and create category model instance
$pdo = connectPDO();
$categoryModel = new CategoryModel($pdo);

// Get all active categories
$categories = $categoryModel->getAllCategories();
?>
<body>
    <div class="container-category">
        <div class="heading-category">Popular Categories</div>
        <div class="scroll-wrapper">
            <?php 
            // Split categories into chunks of 5 for layout purposes
            $categoryChunks = array_chunk($categories, 5);
            
            // Display up to 2 rows of categories
            $maxRows = min(2, count($categoryChunks));
            
            for ($i = 0; $i < $maxRows; $i++) {
                echo '<div class="div-category">';
                foreach ($categoryChunks[$i] as $category) {
                    $categoryImage = !empty($category['image']) ? $category['image'] : '../images/England.svg.png';
                    echo '<div class="link-category">
                        <a href="index.php?page=category&id=' . $category['id'] . '">
                            <img src="' . $categoryImage . '" alt="' . htmlspecialchars($category['name']) . '">
                        </a>
                        <p>' . htmlspecialchars($category['name']) . '</p>
                    </div>';
                }
                echo '</div>';
            }
            
            // If we have fewer than 2 rows but still want to display 2 rows for layout purposes
            if (count($categoryChunks) < 2) {
                echo '<div class="div-category">';
                // Fill with empty placeholders or repeat the first few categories if needed
                for ($i = 0; $i < 5; $i++) {
                    echo '<div class="link-category">
                        <img src="../images/England.svg.png" alt="">
                        <p>Other Categories</p>
                    </div>';
                }
                echo '</div>';
            }
            ?>
        </div>
        <hr style="margin-top: 30px;border: 1px solid rgba(0, 0, 0, 0.3);">
    </div>
    <div class="container-adv">
        <div class="container-adv-scroll">
            <div class="adv-grid-1">
                <div class="adv-1-1 adv advr-trans">
                    <img src="/images/login.svg.png" alt="">
                    <div class="text">
                        <h2>EKO 40" Android TV</h2>
                        <p>SMART FULL HD ANDROID TV WITH GOOGLE ASSISTANT</p>
                    </div>
                    <button class="button">Shop Now</button>
                </div>
                <div class="adv-1-2 adv advl-trans">
                    <img src="/images/login.svg.png" alt="">
                    <div class="text">
                        <h2>EKO 40" Android TV</h2>
                        <p>SMART FULL HD ANDROID TV WITH GOOGLE ASSISTANT</p>
                    </div>
                    <button class="button">Shop Now</button>
                </div>
            </div>
            <div class="adv-grid-2">
                <div class="adv-2-1 adv advt-trans">
                    <img src="../images/England.svg.png" alt="">
                    <div class="text">
                        <h2>EKO 40" Android TV</h2>
                        <p>SMART FULL HD ANDROID TV WITH GOOGLE ASSISTANT</p>
                    </div>
                    <button class="button">Shop Now</button>
                </div>
                <div class="adv-2-2 adv advt-trans">
                    <img src="../images/England.svg.png" alt="">
                    <div class="text">
                        <h2>EKO 40" Android TV</h2>
                        <p>from</p>
                        <p class="price">$199.00</p>
                    </div>
                    <button class="button">Shop Now</button>
                </div>
                <div class="adv-2-3 adv advt-trans">
                    <img src="../images/England.svg.png" alt="">
                    <div class="text">
                        <p>Washing machine</p>
                        <h2>EKO 40" Android TV</h2>
                    </div>
                    <button class="button">Shop Now</button>
                </div>
            </div>
        </div>
    </div>
    <div class="container-main">
        <div class="heading">
            <div class="heading-best">Best Weekly Deals</div>
            <div class="div-countdown">
                <div class="text-wrapper">Expires in:</div>
                <div class="div-item">
                    <div class="div">-132 d</div>
                </div>
                <div class="text-wrapper-2">:</div>
                <div class="div-wrapper">
                    <div class="text-wrapper-3">-9 h</div>
                </div>
                <div class="text-wrapper-4">:</div>
                <div class="div-item-2">
                    <div class="text-wrapper-5">-35 m</div>
                </div>
                <div class="text-wrapper-6">:</div>
                <div class="div-item-3">
                    <div class="text-wrapper-7">-45 s</div>
                </div>
            </div>
        </div>
        <div class="main-section">
            <div class="column">
                <div class="div-deal-card">
                    <div class="link-png"></div>
                    <div class="div-top">
                        <div class="small">
                            <div class="text-wrapper-8">0% Installment</div>
                        </div>
                        <div class="link">
                            <div class="symbol-2"></div>
                        </div>
                    </div>
                    <div class="div-info">
                        <div class="span-label">
                            <div class="text-wrapper-9">15% OFF</div>
                        </div>
                        <p class="link-info">Air Purifier with<br />True HEPA H14 Filter</p>
                        <!-- <div class="symbol-3"></div>
                        <div class="symbol-4"></div>
                        <div class="symbol-5"></div>
                        <div class="symbol-6"></div>
                        <div class="symbol-7"></div>
                        <div class="text-wrapper-10">(5)</div> -->
                        <div class="text-wrapper-11">$489.00</div>
                        <div class="text-wrapper-12">$619.00</div>
                        <div class="div-progress">
                            <div class="progressbar"></div>
                        </div>
                        <div class="text-wrapper-13">Sold: 24 / 80</div>
                    </div>
                </div>
                <div class="div-deal-card">
                    <div class="link-png"></div>
                    <div class="div-top">
                        <div class="small">
                            <div class="text-wrapper-8">0% Installment</div>
                        </div>
                        <div class="link">
                            <div class="symbol-2"></div>
                        </div>
                    </div>
                    <div class="div-info">
                        <div class="span-label">
                            <div class="text-wrapper-9">15% OFF</div>
                        </div>
                        <p class="link-info">Air Purifier with<br />True HEPA H14 Filter</p>
                        <!-- <div class="symbol-3"></div>
                        <div class="symbol-4"></div>
                        <div class="symbol-5"></div>
                        <div class="symbol-6"></div>
                        <div class="symbol-7"></div>
                        <div class="text-wrapper-10">(5)</div> -->
                        <div class="text-wrapper-11">$489.00</div>
                        <div class="text-wrapper-12">$619.00</div>
                        <div class="div-progress">
                            <div class="progressbar"></div>
                        </div>
                        <div class="text-wrapper-13">Sold: 24 / 80</div>
                    </div>
                </div>
            </div>
            <div class="div-deal-card-2">
                <div class="link-png-2"></div>
                <div class="div-top-2">
                    <div class="small">
                        <div class="text-wrapper-8">0% Installment</div>
                    </div>
                    <div class="symbol-wrapper">
                        <div class="symbol-2"></div>
                    </div>
                </div>
                <div class="div-info-3">
                    <div class="span-label">
                        <div class="text-wrapper-9">15% OFF</div>
                    </div>
                    <div class="best-seller-wrapper">
                        <div class="best-seller">BEST SELLER</div>
                    </div>
                    <p class="link-info"> Durotan Manual Espresso Machine, Latte, Cappuccino Maker
                        &amp;<br />Espresso Machine. </p>
                    <!-- <div class="symbol-3"></div>
                    <div class="symbol-4"></div>
                    <div class="symbol-5"></div>
                    <div class="symbol-6"></div>
                    <div class="symbol-8"></div> -->
                    <!-- <div class="text-wrapper-18">(34)</div> -->
                    <div class="text-wrapper-11">$489.00</div>
                    <div class="text-wrapper-12">$619.00</div>
                    <div class="div-progress-2">
                        <div class="progressbar-3"></div>
                    </div>
                    <div class="text-wrapper-19">Sold: 82 / 100</div>
                </div>
            </div>
            <div class="column">
                <div class="div-deal-card">
                    <div class="link-png-3"></div>
                    <div class="div-top">
                        <div class="small">
                            <div class="text-wrapper-8">0% Installment</div>
                        </div>
                        <div class="link">
                            <div class="symbol-2"></div>
                        </div>
                    </div>
                    <div class="div-info">
                        <div class="span-label">
                            <div class="text-wrapper-9">15% OFF</div>
                        </div>
                        <div class="top-rated-wrapper">
                            <div class="top-rated">TOP RATED</div>
                        </div>
                        <p class="link-info">Sona QLED Ultra HD 4k Smart<br />Android TV 59’</p>
                        <!-- <div class="symbol-3"></div>
                        <div class="symbol-4"></div>
                        <div class="symbol-5"></div>
                        <div class="symbol-6"></div>
                        <div class="symbol-8"></div>
                        <div class="text-wrapper-10">(2)</div> -->
                        <div class="text-wrapper-20">$1,759.00</div>
                        <div class="text-wrapper-21">$2,069.00</div>
                        <div class="div-progress">
                            <div class="progressbar-4"></div>
                        </div>
                        <div class="text-wrapper-22">Sold: 7 / 85</div>
                    </div>
                </div>
                <div class="div-deal-card">
                    <div class="link-png-4"></div>
                    <div class="div-top">
                        <div class="symbol-2"></div>
                    </div>
                    <div class="div-info-2">
                        <div class="span-label-3">
                            <div class="text-wrapper-23">pre-order</div>
                        </div>
                        <p class="link-info">Shaork Robot Vacuum with<br />Self-Empty Base</p>
                        <div class="text-wrapper-15">$325.00</div>
                        <div class="text-wrapper-16">$428.00</div>
                        <div class="progressbar-wrapper">
                            <div class="progressbar-2"></div>
                        </div>
                        <div class="text-wrapper-17">Sold: 1 / 19</div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="div-deal-card">
                    <div class="link-png-5"></div>
                    <div class="div-top">
                        <div class="small">
                            <div class="text-wrapper-8">0% Installment</div>
                        </div>
                        <div class="link">
                            <div class="symbol-2"></div>
                        </div>
                    </div>
                    <div class="div-info">
                        <div class="span-label">
                            <div class="text-wrapper-9">15% OFF</div>
                        </div>
                        <p class="link-info">Air Purifier with<br />True HEPA H14 Filter</p>
                        <!-- <div class="symbol-3"></div>
                        <div class="symbol-4"></div>
                        <div class="symbol-5"></div>
                        <div class="symbol-6"></div>
                        <div class="symbol-7"></div>
                        <div class="text-wrapper-10">(5)</div> -->
                        <div class="text-wrapper-11">$489.00</div>
                        <div class="text-wrapper-12">$619.00</div>
                        <div class="div-progress">
                            <div class="progressbar"></div>
                        </div>
                        <div class="text-wrapper-13">Sold: 24 / 80</div>
                    </div>
                </div>
                <div class="div-deal-card">
                    <div class="link-png-6"></div>
                    <div class="div-top">
                        <div class="symbol-2"></div>
                    </div>
                    <div class="div-info-2">
                        <div class="span-label-2">
                            <div class="text-wrapper-14">5% OFF</div>
                        </div>
                        <p class="link-info">Shaork Robot Vacuum with<br />Self-Empty Base</p>
                        <div class="text-wrapper-15">$325.00</div>
                        <div class="text-wrapper-16">$428.00</div>
                        <div class="progressbar-wrapper">
                            <div class="progressbar-2"></div>
                        </div>
                        <div class="text-wrapper-17">Sold: 1 / 19</div>
                    </div>
                </div>
            </div>
            <div class="link-3">
                <button class="text-wrapper-24">See All Products (63)
            </div>
        </div>
    </div>
    <div class="container-hotSearch">
        <div class="heading-trending">Trending Search</div>
        <div class="link">
            <p>Vacuum Robot</p>
        </div>
        <div class="link">
            <p>Bluetooth Speaker</p>
        </div>
        <div class="link">
            <p>Oled Tv</p>
        </div>
        <div class="link">
            <p>Security Camera</p>
        </div>
        <div class="link">
            <p>Macbook M1</p>
        </div>
        <div class="link">
            <p>Smart Washing Machine</p>
        </div>
        <div class="link">
            <p>Ipad Mini 2023</p>
        </div>
        <div class="link">
            <p>Ps5</p>
        </div>
        <div class="link">
            <p>Earbuds</p>
        </div>
        <div class="link">
            <p>Air Condition Inverter</p>
        </div>
        <div class="link">
            <p>Flycam</p>
        </div>
        <div class="link">
            <p>Electric Bike</p>
        </div>
        <div class="link">
            <p>Gaming Computer</p>
        </div>
        <div class="link">
            <p>Smart Air Purifier</p>
        </div>
        <div class="link">
            <p>Apple Watch</p>
        </div>
    </div>
    <div class="container-preorder">
        <img src=".." alt="">
        <div class="grid">
            <div class="item-1">
                <div class="heading">PRE ORDER</div>
                <p>BE THE FIRST TO OWN</p>
                <div class="text-wrapper">From $399</div>
            </div>
            <div class="item-2">
                <div class="div">
                    <p>Opplo Watch Sport<br />Series 8</p>
                    <div class="heading">A healthy leap ahead</div>
                </div>
            </div>
            <button>Discover Now</button>
        </div>
    </div>
    <div class="container-bestseller">
        <div class="heading-bestseller">
            <h3>Best Seller </h3>
            <div class="link-view-all">View all</div>
        </div>
        <div class="tablist">
            <div class="link">
                <p>Top 30</p>
            </div>
            <div class="link">
                <p>Televisions</p>
            </div>
            <div class="link">
                <p>PC Gaming</p>
            </div>
            <div class="link">
                <p>Computers</p>
            </div>
            <div class="link">
                <p>Cameras</p>
            </div>
            <div class="link">
                <p>Gadgets</p>
            </div>
            <div class="link">
                <p>Smart Home</p>
            </div>
            <div class="link">
                <p>Sport Equipments</p>
            </div>
        </div>
        <div class="swiper mySwiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="group">
                        <div class="link-tab">
                            <img src="../images/England.svg.png" alt="">
                        </div>
                        <div class="div-info">
                            <div class="span-label">
                                <div class="new">NEW</div>
                            </div>
                            <div class="best-seller-wrapper">
                                <div class="best-seller">BEST SELLER</div>
                            </div>
                            <p class="name">Shorp 49” Class FHD (1080p)<br />Android Led TV</p>
                            <div class="text-wrapper-7">$3,029.50</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</body>
<?php
include('footer.php'); // Thay đường dẫn nếu cần
?>
