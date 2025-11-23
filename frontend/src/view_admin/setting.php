<div class="settings-container">
    <h2><i class="fas fa-cogs"></i> Admin Settings</h2>
    <form id="adminSettingsForm">

        <div class="form-group">
            <label for="siteName">Site Name</label>
            <input type="text" id="siteName" class="form-control" placeholder="Enter site name">
        </div>

        <div class="form-group">
            <label for="adminEmail">Admin Email</label>
            <input type="email" id="adminEmail" class="form-control" placeholder="Enter admin email">
        </div>

        <div class="form-group">
            <label for="maintenanceMode">Maintenance Mode</label>
            <select id="maintenanceMode" class="form-control">
                <option value="off">Off</option>
                <option value="on">On</option>
            </select>
        </div>

        <div class="form-group full-width">
            <label for="siteDescription">Site Description</label>
            <textarea id="siteDescription" class="form-control" rows="4" placeholder="Short description about your site"></textarea>
        </div>

        <div class="form-group">
            <label for="changePassword">New Admin Password</label>
            <input type="password" id="changePassword" class="form-control" placeholder="Leave blank to keep current password">
        </div>

        <div class="form-actions">
            <button type="button" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-save">Save Settings</button>
        </div>

    </form>
</div>