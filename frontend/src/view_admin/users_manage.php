<div class="main-content">
    <div class="header">
        <h1><i class="fas fa-users"></i> User Management</h1>
        <button class="btn-add" onclick="addUser()">+ Add User</button>
    </div>

    <div class="controls-container">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchUsers" placeholder="Search users...">
        </div>
        <div>
            <select id="statusFilter" class="filter-dropdown">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
        </div>
    </div>

    <div class="table-container">
        <table id="userTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- User list will be rendered by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Add/Edit User Modal -->
<div id="userModal" class="modal">
    <div class="modal-content">
        <span class="close-button" onclick="closeUserModal()">&times;</span>
        <h2><i class="fas fa-user-edit"></i> <span id="modalTitle">Add New User</span></h2>
        <form id="userForm" onsubmit="saveUser(event)">
            <div class="form-grid">
                <div class="form-group">
                    <label for="userName">Username</label>
                    <input type="text" id="userName" required>
                </div>
                <div class="form-group">
                    <label for="userEmail">Email</label>
                    <input type="email" id="userEmail" required>
                </div>
                <div class="form-group">
                    <label for="userPhone">Phone Number</label>
                    <input type="text" id="userPhone">
                </div>
                <div class="form-group">
                    <label for="userStatus">Status</label>
                    <select id="userStatus">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label for="userAddress">Address</label>
                    <textarea id="userAddress"></textarea>
                </div>
                <div class="form-group full-width">
                    <label class="toggle-container">
                        <span>Admin Privileges</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="userAdmin">
                            <span class="slider"></span>
                        </label>
                    </label>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeUserModal()">Cancel</button>
                <button type="submit" class="btn-save">Save</button>
            </div>
        </form>
    </div>
</div>