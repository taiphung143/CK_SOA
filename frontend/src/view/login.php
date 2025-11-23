<?php
// Nếu đã đăng nhập, chuyển về trang chủ
if (isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
}
?>

<?php
$page = 'login';
include('header.php'); // Thay đường dẫn nếu cần
?>

<!-- Main Content -->
<main>
    <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="index.php">Home</a>
            <span>/</span>
            <span class="current">Login</span>
        </div>

        <!-- Login Section Wrapper -->
        <div class="login-wrapper">
            <!-- Image on the Left -->
            <div class="login-side-image">
                <img src="images/login.svg.png" alt="Login Image">
            </div>

            <!-- Login Form -->
            <div class="login-form-container">
                <div class="login-image">
                    <i class="fas fa-user-circle fa-5x"></i>
                </div>
                <h3>Welcome Back</h3>
                <p class="login-subtitle">Login to continue</p>

                <!-- Hiển thị lỗi nếu có -->
                <?php if (isset($error)): ?>
                    <div id="error-message" style="color:red; text-align:center; margin-bottom: 15px;">
                        <?= isset($error_is_html) && $error_is_html ? $error : htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <form class="login-form" method="POST" action="index.php?page=login" id="login-form">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" placeholder="Example@gmail.com" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="...." required>
                        <i class="fas fa-eye-slash password-toggle"></i>
                    </div>                    <div class="form-actions">
                        <a href="#" class="forgot-password" id="forgot-password-link">Forget Password?</a>
                        <button type="submit" name="login" class="login-button">Login</button>
                    </div>
                    <div class="signup-link">
                        <span>New user? <a href="index.php?page=register">Sign Up</a></span>
                    </div>
                </form>
                  <!-- Nếu tài khoản chưa xác thực -->
                <?php if (isset($error_is_html) && $error_is_html): ?>
                    <div id="resend-container" style="text-align:center; margin-top:15px;">
                        <p>Tài khoản chưa được xác thực. Vui lòng kiểm tra email hoặc 
                        <a href="javascript:void(0);" id="resend-verification-link" data-email="<?= htmlspecialchars($unverified_email ?? '') ?>">gửi lại email xác thực</a>
                        </p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>

<?php
include('footer.php'); // Thay đường dẫn nếu cần
?>

<!-- Password Reset Modal -->
<div id="password-reset-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Reset Password</h2>
        <p>Enter your email address and we'll send you a new password.</p>
        <div id="modal-message" style="display:none;"></div>
        <form id="password-reset-form" method="POST" action="/controller/forget_password.php">
            <div class="form-group">
                <label for="reset-email">Email Address</label>
                <input type="email" id="reset-email" name="email" placeholder="Enter your email" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="reset-button">Send Reset Link</button>
            </div>
        </form>
    </div>
</div>

<style>
/* Modal styles */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 30px;
    border: 1px solid #888;
    width: 400px;
    max-width: 90%;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    position: relative;
}

.modal h2 {
    margin-top: 0;
    color: #333;
}

.close {
    position: absolute;
    top: 15px;
    right: 20px;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: #000;
}

#modal-message {
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 4px;
}

#modal-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

#modal-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.reset-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    width: 100%;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 10px;
}

.reset-button:hover {
    background-color: #0069d9;
}
</style>

<script>
    // Display password reset status messages if they exist
    window.onload = function() {
        <?php if(isset($_SESSION['password_reset_success'])): ?>
            alert("<?php echo $_SESSION['password_reset_success']; ?>");
            <?php unset($_SESSION['password_reset_success']); ?>
        <?php endif; ?>

        <?php if(isset($_SESSION['password_reset_error'])): ?>
            alert("<?php echo $_SESSION['password_reset_error']; ?>");
            <?php unset($_SESSION['password_reset_error']); ?>
        <?php endif; ?>
    };

    // Password reset modal functionality
    var modal = document.getElementById('password-reset-modal');
    var forgotLink = document.getElementById('forgot-password-link');
    var span = document.getElementsByClassName('close')[0];
    var modalMessage = document.getElementById('modal-message');
    var resetForm = document.getElementById('password-reset-form');

    // Open the modal when the "Forgot Password" link is clicked
    forgotLink.onclick = function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    }

    // Close the modal when the X is clicked
    span.onclick = function() {
        modal.style.display = 'none';
        resetForm.reset();
        modalMessage.style.display = 'none';
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            resetForm.reset();
            modalMessage.style.display = 'none';
        }
    }

    // Handle password reset form submission via AJAX
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var email = document.getElementById('reset-email').value;
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'index.php?page=controller/forget_password', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    try {
                        var response = JSON.parse(xhr.responseText);
                        
                        modalMessage.style.display = 'block';
                        
                        if (response.success) {
                            modalMessage.className = 'success';
                            modalMessage.innerHTML = response.message;
                            resetForm.reset();
                            
                            // Close the modal after a delay
                            setTimeout(function() {
                                modal.style.display = 'none';
                                modalMessage.style.display = 'none';
                            }, 3000);
                        } else {
                            modalMessage.className = 'error';
                            modalMessage.innerHTML = response.message;
                        }
                    } catch (e) {
                        modalMessage.className = 'error';
                        modalMessage.innerHTML = 'An unexpected error occurred. Please try again.';
                        modalMessage.style.display = 'block';
                    }
                } else {
                    modalMessage.className = 'error';
                    modalMessage.innerHTML = 'Server error. Please try again later.';
                    modalMessage.style.display = 'block';
                }
            }
        };
        
        xhr.send('email=' + encodeURIComponent(email));
    });

    // Existing code for email verification
    if (document.getElementById('resend-verification-link')) {
        document.getElementById('resend-verification-link').addEventListener('click', function() {
            var email = this.getAttribute('data-email');
            
            // Gửi yêu cầu Ajax gửi lại email xác thực
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'index.php?page=login', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText);
                    
                    if (response.success) {
                        document.getElementById('error-message').innerHTML = "Mã xác thực đã được gửi lại vào email của bạn!";
                        document.getElementById('error-message').style.color = "green";
                    } else {
                        document.getElementById('error-message').innerHTML = response.message;
                    }
                }
            };
            xhr.send('resend_verification=true&email=' + encodeURIComponent(email));
        });
    }
</script>
