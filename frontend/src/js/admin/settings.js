const API_BASE_URL = 'http://localhost:3000/api';

function getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Tab navigation
document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Load site settings
async function loadSiteSettings() {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/settings/site`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('site-name').value = data.settings.site_name || '';
            document.getElementById('site-description').value = data.settings.site_description || '';
            document.getElementById('contact-email').value = data.settings.contact_email || '';
            document.getElementById('contact-phone').value = data.settings.contact_phone || '';
        }
    } catch (error) {
        console.error('Failed to load site settings:', error);
    }
}

// Save site settings
document.getElementById('site-settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    
    const formData = new FormData(e.target);
    const settings = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/settings/site`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        
        if (response.ok) {
            alert('Site settings updated successfully');
        }
    } catch (error) {
        console.error('Failed to update site settings:', error);
    }
});

// Load payment settings
async function loadPaymentSettings() {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/settings/payment`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('vnpay-enabled').checked = data.settings.vnpay_enabled || false;
            document.getElementById('vnpay-merchant-id').value = data.settings.vnpay_merchant_id || '';
            document.getElementById('vnpay-secret-key').value = data.settings.vnpay_secret_key || '';
            
            document.getElementById('momo-enabled').checked = data.settings.momo_enabled || false;
            document.getElementById('momo-partner-code').value = data.settings.momo_partner_code || '';
            document.getElementById('momo-access-key').value = data.settings.momo_access_key || '';
            
            document.getElementById('cod-enabled').checked = data.settings.cod_enabled || false;
        }
    } catch (error) {
        console.error('Failed to load payment settings:', error);
    }
}

// Save payment settings
document.getElementById('payment-settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    
    const settings = {
        vnpay_enabled: document.getElementById('vnpay-enabled').checked,
        vnpay_merchant_id: document.getElementById('vnpay-merchant-id').value,
        vnpay_secret_key: document.getElementById('vnpay-secret-key').value,
        momo_enabled: document.getElementById('momo-enabled').checked,
        momo_partner_code: document.getElementById('momo-partner-code').value,
        momo_access_key: document.getElementById('momo-access-key').value,
        cod_enabled: document.getElementById('cod-enabled').checked
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/settings/payment`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        
        if (response.ok) {
            alert('Payment settings updated successfully');
        }
    } catch (error) {
        console.error('Failed to update payment settings:', error);
    }
});

// Load email settings
async function loadEmailSettings() {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/settings/email`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('smtp-host').value = data.settings.smtp_host || '';
            document.getElementById('smtp-port').value = data.settings.smtp_port || '';
            document.getElementById('smtp-username').value = data.settings.smtp_username || '';
            document.getElementById('smtp-password').value = data.settings.smtp_password || '';
            document.getElementById('from-email').value = data.settings.from_email || '';
            document.getElementById('from-name').value = data.settings.from_name || '';
        }
    } catch (error) {
        console.error('Failed to load email settings:', error);
    }
}

// Save email settings
document.getElementById('email-settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    
    const formData = new FormData(e.target);
    const settings = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/settings/email`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        
        if (response.ok) {
            alert('Email settings updated successfully');
        }
    } catch (error) {
        console.error('Failed to update email settings:', error);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSiteSettings();
    loadPaymentSettings();
    loadEmailSettings();
});