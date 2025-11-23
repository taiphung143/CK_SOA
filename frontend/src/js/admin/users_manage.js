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
        
        if (data.success) {
            displayUsers(data.users);
        }
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// Display users in table
function displayUsers(users) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td><img src="${user.avatar || '/images/default-avatar.png'}" width="40" height="40"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge bg-${user.role === 'admin' ? 'danger' : 'primary'}">${user.role}</span></td>
            <td><span class="badge bg-${user.is_verified ? 'success' : 'warning'}">${user.is_verified ? 'Verified' : 'Pending'}</span></td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewUser(${user.id})">View</button>
                <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        </tr>
    `).join('');
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