    <!-- Footer -->
    <footer>
        <?php if (!isset($_SESSION['user'])): ?>
        <!-- Subscription Section -->
        <div class="subscription-section">
            <div class="container">
                <div class="subscription-content">
                    <i class="fas fa-paper-plane fa-3x plane-icon"></i>
                    <h3>Subscribe & Get 10% OFF for first order</h3>
                    <form id="subscription-form" class="subscription-form">
                        <div class="form-group">
                            <span class="icon"><i class="fas fa-envelope"></i></span>
                            <input type="email" id="subscribeEmail" name="email" placeholder="Enter your email address" required>
                            <button type="button" id="subscribeBtn">Subscribe</button>
                        </div>
                        <div id="subscribe-message" style="margin-top:10px;font-size:14px;"></div>
                    </form>

                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- Features Section -->
        <div class="features-section">
            <div class="container">
                <div class="features-content">
                    <div class="feature-1">
                        <i class="fas fa-shipping-fast"></i>
                        <span>Free Shipping over $99</span>
                    </div>
                    <div class="feature-2">
                        <i class="fas fa-undo"></i>
                        <span>30 Days money back</span>
                    </div>
                    <div class="feature-3">
                        <i class="fas fa-lock"></i>
                        <span>100% Secure Payment</span>
                    </div>
                    <div class="feature-4">
                        <i class="fas fa-headset"></i>
                        <span>24/7 Dedicated Support</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Footer -->
        <div class="main-footer">
            <div class="container">
                <div class="footer-content">
                    <div class="company-info">
                        <h6>Shop365 - e-commerce platform</h6>
                        <small>hotline 24/7</small>
                        <h5>(012) 3456 789</h5>
                        <p>19 Nguyễn Hữu Thọ, Tân Phong, Quận 7, Hồ Chí Minh<br>contact@shop365.vn</p>
                        <div class="social-links">
                            <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div class="footer-links">
                        <div class="link-group">
                            <h6>Company</h6>
                            <ul>
                                <li><a href="#">About Shop365</a></li>
                                <li><a href="index.php?page=contact">Contact</a></li>
                                <li><a href="#">Sitemap</a></li>
                            </ul>
                        </div>
                        <div class="link-group">
                            <h6>Help Center</h6>
                            <ul>
                                <li><a href="#">Customer Service</a></li>
                                <li><a href="#">Policy</a></li>
                                <li><a href="#">Terms & Conditions</a></li>
                                <li><a href="#">Track Order</a></li>
                                <li><a href="#">FAQs</a></li>
                                <li><a href="#">My Account</a></li>
                            </ul>
                        </div>
                        <div class="link-group">
                            <h6>Partner</h6>
                            <ul>
                                <li><a href="#">Become Seller</a></li>
                                <li><a href="#">Affiliate</a></li>
                                <li><a href="#">Advertise</a></li>
                                <li><a href="#">Partnership</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <div class="copyright">
                        <p>© 2025 <b>Shop365</b> . All Rights Reserved</p>
                    </div>
                    <div class="payment-methods-footer">
                        <img class="Momo" src="images/momo.png" alt="Momo">
                        <img src="images/mastercard.png" alt="Mastercard">
                        <img src="images/visa.png" alt="visa">
                        <img src="images/vnpay.png" alt="vnpay">
                    </div>
                    <div class="language-currency-footer">
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
    </footer>

    <!-- JavaScript -->
    <script src="js/header.js"></script>
    <!-- Js riêng cho từng trang -->
    <?php if (isset($page) && $page == 'login'): ?>
        <script src="js/login.js"></script>
    <?php endif; ?>

    <?php if (isset($page) && $page == 'home'): ?>
        <script src="js/home.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <?php endif; ?>

    <?php if (isset($page) && $page == 'register'): ?>
        <script src="js/register.js"></script>
    <?php endif; ?>

    <?php if (isset($page) && $page == 'contact'): ?>
        <script src="js/contact.js"></script>
    <?php endif; ?>
    
    <?php if (isset($page) && $page == 'category'): ?>
        <script src="js/category.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <?php endif; ?>
    <script>
// Check if subscription button exists before adding event listener
const subscribeBtn = document.getElementById("subscribeBtn");
if (subscribeBtn) {
    subscribeBtn.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default form submission
        const email = document.getElementById("subscribeEmail").value; // Get the value of the email field
        const message = document.getElementById("subscribe-message");

        if (!email) {
            message.innerText = "Vui lòng nhập email.";
            message.style.color = "red";
            return;
        }

        // Send the email via Ajax (using fetch)
        fetch('ajax/subscribe.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }) // Send email data as JSON
        })
        .then(res => res.json())
        .then(data => {
            message.innerText = data.message;
            message.style.color = data.success ? "green" : "red"; // Change message color based on success
        })
        .catch(err => {
            message.innerText = "Đã có lỗi xảy ra!";
            message.style.color = "red"; // Error handling
        });
    });
}

</script>

<!-- <script type="text/javascript" src="https://livechat.pavietnam.vn/js/script.js" id="live_chat_30s" data-lang="en"></script> -->

    </body>
</html>