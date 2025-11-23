<?php
session_start();
session_unset();      // Xoá tất cả các biến session
session_destroy();    // Hủy phiên làm việc

// Chuyển hướng về trang chủ hoặc trang đăng nhập
header("Location: index.php");
exit();
