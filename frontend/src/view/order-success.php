<?php
// Get payment status from controller
$paymentStatus = isset($_SESSION['payment_status']) ? $_SESSION['payment_status'] : 'unknown';
$paymentMessage = isset($_SESSION['payment_message']) ? $_SESSION['payment_message'] : '';
$order = isset($data['order']) ? $data['order'] : null;
file_put_contents('log.txt', "Payment Status: $paymentStatus, Message: $paymentMessage, Order: $order\n", FILE_APPEND);
// Clear the session variables after use
unset($_SESSION['payment_status']);
unset($_SESSION['payment_message']);

// Get VNPay parameters for display
$vnp_Amount = isset($_GET['vnp_Amount']) ? number_format($_GET['vnp_Amount']/100) : 0;
$vnp_BankCode = isset($_GET['vnp_BankCode']) ? $_GET['vnp_BankCode'] : '';
$vnp_TransactionNo = isset($_GET['vnp_TransactionNo']) ? $_GET['vnp_TransactionNo'] : '';
$vnp_PayDate = isset($_GET['vnp_PayDate']) ? $_GET['vnp_PayDate'] : '';
$vnp_CardType = isset($_GET['vnp_CardType']) ? $_GET['vnp_CardType'] : '';

// Format payment date if available
$formattedPayDate = '';
if (!empty($vnp_PayDate)) {
    $year = substr($vnp_PayDate, 0, 4);
    $month = substr($vnp_PayDate, 4, 2);
    $day = substr($vnp_PayDate, 6, 2);
    $hour = substr($vnp_PayDate, 8, 2);
    $minute = substr($vnp_PayDate, 10, 2);
    $second = substr($vnp_PayDate, 12, 2);
    $formattedPayDate = "$day/$month/$year $hour:$minute:$second";
}
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt hàng thành công - Web Shop</title>
    <link rel="stylesheet" href="css/globals.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/footer.css">
    <link rel="stylesheet" href="css/order-success.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .order-success-container {
            max-width: 800px;
            margin: 30px auto;
            padding: 25px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .order-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .order-header h1 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .notification-banner {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        
        .notification-banner i {
            font-size: 24px;
            margin-right: 15px;
        }
        
        .success-banner {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .error-banner {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .pending-banner {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }
        
        .order-details {
            margin-bottom: 25px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .detail-row strong {
            color: #333;
        }
        
        .payment-details {
            margin-bottom: 30px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }
        
        .payment-details h3 {
            margin-bottom: 15px;
            color: #333;
        }
        
        .order-items {
            margin-bottom: 30px;
        }
        
        .order-items h3 {
            margin-bottom: 15px;
            color: #333;
        }
        
        .item-list {
            border: 1px solid #eee;
            border-radius: 5px;
        }
        
        .item {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .item:last-child {
            border-bottom: none;
        }
        
        .item-image {
            width: 80px;
            height: 80px;
            border-radius: 5px;
            overflow: hidden;
            margin-right: 15px;
        }
        
        .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .item-details {
            flex-grow: 1;
        }
        
        .item-price {
            font-weight: bold;
            color: #333;
        }
        
        .action-buttons {
            text-align: center;
            margin-top: 30px;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            margin: 0 10px;
        }
        
        .btn-primary {
            background-color: #007bff;
            color: white;
        }
        
        .btn-primary:hover {
            background-color: #0069d9;
        }
        
        .btn-outline {
            background-color: transparent;
            color: #007bff;
            border: 1px solid #007bff;
        }
        
        .btn-outline:hover {
            background-color: #f8f9fa;
        }
        
        .transaction-info {
            background-color: #f8f9fa;
            border: 1px solid #eee;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .bank-info {
            display: flex;
            align-items: center;
            margin-top: 10px;
        }
        
        .bank-logo {
            width: 60px;
            margin-right: 15px;
        }
        
        @media (max-width: 768px) {
            .order-success-container {
                margin: 20px 15px;
                padding: 15px;
            }
            
            .item {
                flex-direction: column;
                align-items: flex-start;
                text-align: center;
            }
            
            .item-image {
                margin: 0 auto 15px;
            }
            
            .action-buttons {
                display: flex;
                flex-direction: column;
            }
            
            .btn {
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <?php include 'header.php'; ?>
    
    <div class="order-success-container">
        <div class="order-header">
            <?php if ($paymentStatus == 'success'): ?>
                <i class="fas fa-check-circle" style="font-size: 60px; color: #28a745; margin-bottom: 20px;"></i>
                <h1>Thanh toán thành công!</h1>
            <?php elseif ($paymentStatus == 'failed'): ?>
                <i class="fas fa-times-circle" style="font-size: 60px; color: #dc3545; margin-bottom: 20px;"></i>
                <h1>Thanh toán không thành công</h1>
            <?php elseif ($paymentStatus == 'pending'): ?>
                <i class="fas fa-clock" style="font-size: 60px; color: #ffc107; margin-bottom: 20px;"></i>
                <h1>Đơn hàng đang xử lý</h1>
            <?php else: ?>
                <i class="fas fa-info-circle" style="font-size: 60px; color: #17a2b8; margin-bottom: 20px;"></i>
                <h1>Thông tin đơn hàng</h1>
            <?php endif; ?>
        </div>
        
        <?php if (!empty($paymentMessage)): ?>
            <div class="notification-banner <?php echo $paymentStatus == 'success' ? 'success-banner' : ($paymentStatus == 'failed' ? 'error-banner' : 'pending-banner'); ?>">
                <i class="fas <?php echo $paymentStatus == 'success' ? 'fa-check-circle' : ($paymentStatus == 'failed' ? 'fa-times-circle' : 'fa-info-circle'); ?>"></i>
                <span><?php echo $paymentMessage; ?></span>
            </div>
        <?php endif; ?>
        
        <?php if ($order): ?>
            <div class="order-details">
                <h3>Thông tin đơn hàng</h3>
                <div class="detail-row">
                    <span>Mã đơn hàng:</span>
                    <strong>#<?php echo $order['id']; ?></strong>
                </div>
                <div class="detail-row">
                    <span>Ngày đặt:</span>
                    <strong><?php echo date('d/m/Y H:i', strtotime($order['created_at'])); ?></strong>
                </div>
                <div class="detail-row">
                    <span>Trạng thái:</span>
                    <strong>
                        <?php 
                        switch($order['status']) {
                            case 'pending': echo 'Chờ xử lý'; break;
                            case 'paid': echo 'Đã thanh toán'; break;
                            case 'processing': echo 'Đang xử lý'; break;
                            case 'shipped': echo 'Đang giao hàng'; break;
                            case 'delivered': echo 'Đã giao hàng'; break;
                            case 'cancelled': echo 'Đã hủy'; break;
                            case 'refunded': echo 'Đã hoàn tiền'; break;
                            default: echo 'Không xác định'; break;
                        }
                        ?>
                    </strong>
                </div>
                <div class="detail-row">
                    <span>Tổng tiền:</span>
                    <strong><?php echo number_format($order['total'], 0, ',', '.'); ?> ₫</strong>
                </div>
            </div>
            
            <div class="payment-details">
                <h3>Thông tin thanh toán</h3>
                <div class="detail-row">
                    <span>Phương thức thanh toán:</span>
                    <strong>
                        <?php 
                        if (isset($order['payment_method'])) {
                            switch($order['payment_method']) {
                                case 'cod': echo 'Thanh toán khi nhận hàng (COD)'; break;
                                case 'vnpay': echo 'VNPAY'; break;
                                case 'momo': echo 'MoMo'; break;
                                default: echo $order['payment_method']; break;
                            }
                        } else {
                            echo 'Không xác định';
                        }
                        ?>
                    </strong>
                </div>
                
                <?php if (!empty($vnp_TransactionNo)): ?>
                <div class="transaction-info">
                    <h4>Thông tin giao dịch VNPay</h4>
                    <div class="detail-row">
                        <span>Mã giao dịch:</span>
                        <strong><?php echo $vnp_TransactionNo; ?></strong>
                    </div>
                    <?php if (!empty($formattedPayDate)): ?>
                    <div class="detail-row">
                        <span>Thời gian thanh toán:</span>
                        <strong><?php echo $formattedPayDate; ?></strong>
                    </div>
                    <?php endif; ?>
                    <?php if (!empty($vnp_CardType) && !empty($vnp_BankCode)): ?>
                    <div class="detail-row">
                        <span>Loại thẻ/Tài khoản:</span>
                        <strong><?php echo $vnp_CardType; ?></strong>
                    </div>
                    <div class="bank-info">
                        <span>Ngân hàng:</span>
                        <strong><?php echo $vnp_BankCode; ?></strong>
                        <?php if ($vnp_BankCode == 'NCB'): ?>
                            <img src="images/vnpay.png" alt="VNPay" class="bank-logo">
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
            
            <div class="shipping-details">
                <h3>Thông tin giao hàng</h3>
                <div class="detail-row">
                    <span>Người nhận:</span>
                    <strong><?php echo isset($order['recipient_name']) ? $order['recipient_name'] : ''; ?></strong>
                </div>
                <div class="detail-row">
                    <span>Số điện thoại:</span>
                    <strong><?php echo isset($order['phone']) ? $order['phone'] : ''; ?></strong>
                </div>
                <div class="detail-row">
                    <span>Địa chỉ:</span>
                    <strong>
                        <?php 
                        $address = [];
                        if (!empty($order['street_address'])) $address[] = $order['street_address'];
                        if (!empty($order['city'])) $address[] = $order['city'];
                        if (!empty($order['state'])) $address[] = $order['state'];
                        if (!empty($order['postal_code'])) $address[] = $order['postal_code'];
                        if (!empty($order['country'])) $address[] = $order['country'];
                        echo implode(', ', $address);
                        ?>
                    </strong>
                </div>
            </div>
            
            <?php if (isset($order['items']) && !empty($order['items'])): ?>
            <div class="order-items">
                <h3>Sản phẩm đã mua</h3>
                <div class="item-list">
                    <?php foreach ($order['items'] as $item): ?>
                    <div class="item">
                        <div class="item-image">
                            <img src="<?php echo !empty($item['image_thumbnail']) ? $item['image_thumbnail'] : 'images/product-image.png'; ?>" alt="<?php echo $item['name']; ?>">
                        </div>
                        <div class="item-details">
                            <h4><?php echo $item['name']; ?></h4>
                            <p>SKU: <?php echo $item['sku']; ?></p>
                            <p>Số lượng: <?php echo $item['quantity']; ?></p>
                        </div>
                        <div class="item-price">
                            <?php echo number_format($item['price'], 0, ',', '.'); ?> ₫
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        <?php else: ?>
        <?php endif; ?> 
        
        <div class="action-buttons">
            <a href="index.php" class="btn btn-outline"><i class="fas fa-home"></i> Trở về trang chủ</a>
            <?php if (isset($_SESSION['user']['id'])): ?>
            <a href="index.php?page=profile&section=orders" class="btn btn-primary"><i class="fas fa-list"></i> Xem đơn hàng của tôi</a>
            <?php endif; ?>
        </div>
    </div>
    
    <?php include 'footer.php'; ?>
    
    <script>
    // Automatically show notification when page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we have payment status from VNPay
        const paymentStatus = '<?php echo $paymentStatus; ?>';
        
        if (paymentStatus) {
            const notification = document.createElement('div');
            notification.className = `notification ${paymentStatus === 'success' ? 'success' : (paymentStatus === 'failed' ? 'error' : 'info')}`;
            
            const icon = document.createElement('i');
            icon.className = paymentStatus === 'success' ? 'fas fa-check-circle' : (paymentStatus === 'failed' ? 'fas fa-times-circle' : 'fas fa-info-circle');
            
            const messageText = document.createElement('span');
            messageText.textContent = '<?php echo addslashes($paymentMessage); ?>';
            
            notification.appendChild(icon);
            notification.appendChild(messageText);
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // Hide notification after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        }
    });
    </script>
</body>
</html>
