const API_BASE_URL = 'http://localhost:3000/api';

function getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Load all users
async function loadUsers() {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        console.log('Users API Response:', data); // Debug log
        
        if (data.success) {
            // API returns data.data.users, not data.users
            const users = data.data?.users || data.users || [];
            displayUsers(users);
        } else {
            console.error('API returned error:', data);
            alert('Failed to load users: ' + (data.error?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Failed to load users:', error);
        alert('Network error: ' + error.message);
    }
}

// Display users in table
function displayUsers(users) {
    const container = document.getElementById('users-table-container');
    
    if (!container) {
        console.error('Container element not found');
        return;
    }
    
    if (!users || users.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No users found</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td><img src="${user.avatar || '/images/default-avatar.png'}" width="40" height="40" class="rounded-circle"></td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td><span class="badge bg-${user.role === 'admin' ? 'danger' : 'primary'}">${user.role}</span></td>
                            <td><span class="badge bg-${user.is_verified ? 'success' : 'warning'}">${user.is_verified ? 'Verified' : 'Pending'}</span></td>
                            <td>${new Date(user.created_at).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-info" onclick="viewUser(${user.id})"><i class="fas fa-eye"></i></button>
                                <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            alert('User deleted successfully');
            loadUsers();
        }
    } catch (error) {
        console.error('Failed to delete user:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadUsers);