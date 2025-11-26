# Admin API Test - PowerShell
# Test admin panel API endpoints with authentication

Write-Host "🧪 Testing Admin Panel APIs" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$API_BASE = "http://localhost:3000/api"

# Test 1: Login as admin to get token
Write-Host "`n1️⃣ Testing Admin Login..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "admin@example.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$API_BASE/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    
    if ($loginResponse.success) {
        $token = $loginResponse.data.token
        Write-Host "✅ Login successful! Token obtained." -ForegroundColor Green
        Write-Host "User: $($loginResponse.data.user.name) (Role: $($loginResponse.data.user.role))" -ForegroundColor Green
    } else {
        Write-Host "❌ Login failed: $($loginResponse.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Login error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⚠️  Please ensure there's an admin user with email 'admin@example.com' and password 'admin123'" -ForegroundColor Yellow
    exit 1
}

# Prepare auth headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 2: Get User Stats
Write-Host "`n2️⃣ Testing User Stats..." -ForegroundColor Yellow
try {
    $userStats = Invoke-RestMethod -Uri "$API_BASE/users/stats" -Method Get -Headers $headers
    Write-Host "✅ User Stats: Total Users = $($userStats.data.totalUsers)" -ForegroundColor Green
} catch {
    Write-Host "❌ User Stats failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Order Stats
Write-Host "`n3️⃣ Testing Order Stats..." -ForegroundColor Yellow
try {
    $orderStats = Invoke-RestMethod -Uri "$API_BASE/orders/stats" -Method Get -Headers $headers
    Write-Host "✅ Order Stats: Total Orders = $($orderStats.data.totalOrders)" -ForegroundColor Green
} catch {
    Write-Host "❌ Order Stats failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Product Stats
Write-Host "`n4️⃣ Testing Product Stats..." -ForegroundColor Yellow
try {
    $productStats = Invoke-RestMethod -Uri "$API_BASE/products/stats" -Method Get -Headers $headers
    Write-Host "✅ Product Stats: Total Products = $($productStats.data.totalProducts)" -ForegroundColor Green
} catch {
    Write-Host "❌ Product Stats failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get All Users (Admin Only)
Write-Host "`n5️⃣ Testing Get All Users..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "$API_BASE/users" -Method Get -Headers $headers
    Write-Host "✅ Users List: Found $($users.data.length) users" -ForegroundColor Green
} catch {
    Write-Host "❌ Get Users failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get All Orders (Admin)
Write-Host "`n6️⃣ Testing Get All Orders..." -ForegroundColor Yellow
try {
    $orders = Invoke-RestMethod -Uri "$API_BASE/orders" -Method Get -Headers $headers
    Write-Host "✅ Orders List: Found $($orders.data.length) orders" -ForegroundColor Green
} catch {
    Write-Host "❌ Get Orders failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Get All Vouchers
Write-Host "`n7️⃣ Testing Get All Vouchers..." -ForegroundColor Yellow
try {
    $vouchers = Invoke-RestMethod -Uri "$API_BASE/orders/vouchers" -Method Get -Headers $headers
    Write-Host "✅ Vouchers List: Found $($vouchers.data.length) vouchers" -ForegroundColor Green
} catch {
    Write-Host "❌ Get Vouchers failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Get Revenue Stats
Write-Host "`n8️⃣ Testing Revenue Stats..." -ForegroundColor Yellow
try {
    $revenue = Invoke-RestMethod -Uri "$API_BASE/orders/revenue" -Method Get -Headers $headers
    Write-Host "✅ Revenue: Total = $($revenue.data.totalRevenue)" -ForegroundColor Green
} catch {
    Write-Host "❌ Revenue Stats failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Admin API Tests Complete!" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan