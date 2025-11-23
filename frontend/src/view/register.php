<?php
// Nếu đã đăng nhập, chuyển về trang chủ
if (isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
}
?>

<?php
$page = 'register';
include('header.php'); // Thay đường dẫn nếu cần
?>

<!-- Main Content -->
<main>
    <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="index.php">Home</a>
            <span>/</span>
            <span class="current">Register</span>
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
                <h3>Register</h3>
                <p class="login-subtitle">JOIN TO US</p>

                <!-- Hiển thị lỗi nếu có -->
                <?php if (isset($error)): ?>
                    <div class="error-message" style="color:red; text-align:center; margin-bottom: 15px;">
                        <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <div id="register-message" style="display: block; background-color: #E8F5E9; text-align:center; margin-bottom: 15px; color: red;"></div>                <form class="login-form" id="register-form" method="POST">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input type="text" id="name" name="name" placeholder="Nguyen Van A" 
                            value="<?= htmlspecialchars($name ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="username123" 
                            value="<?= htmlspecialchars($username ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" placeholder="Example@gmail.com" 
                            value="<?= htmlspecialchars($email ?? '') ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="...." required>
                        <i class="fas fa-eye-slash password-toggle" data-target="password"></i>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirm_password" placeholder="...." required>
                        <i class="fas fa-eye-slash password-toggle" data-target="confirm-password"></i>
                    </div>
                    <div class="form-actions">
                        <button type="submit" name="register" class="login-button">Register</button>
                    </div>
                    <div class="signup-link">
                        <span>Already user? <a href="index.php?page=login">Login</a></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>


<script>
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();

    registerForm = document.getElementById('register-form');
    
    const form = e.target;
    const formData = new FormData(form);
    formData.append('register', '1'); // ← Thêm dòng này

    // Show loading state
    const submitButton = registerForm.querySelector('.login-button');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Registering...';

    const messageDiv = document.getElementById('register-message');

    fetch('index.php?page=register', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        messageDiv.innerText = data.message;
        messageDiv.style.color = data.success ? 'green' : 'red';
        if (data.success) {
            form.reset();
        }
    })
    .catch(err => {
        console.error('Lỗi:', err);
        messageDiv.innerText = 'Lỗi xử lý phản hồi!';
        messageDiv.style.color = 'red';
    });
});


</script>

<?php


include('footer.php'); // Thay đường dẫn nếu cần
?>
