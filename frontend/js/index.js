import api from '../services/api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (api.auth.isLoggedIn()) {
        // Update login button to dashboard
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.href = 'dashboard.html';
        }
    }
});
