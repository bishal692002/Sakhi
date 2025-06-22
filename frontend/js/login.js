import api from '../services/api.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageElement = document.getElementById('error-message');
    
    // Check if user is already logged in
    if (api.auth.isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
    
    loginBtn.addEventListener('click', async function() {
        // Basic validation
        if (!emailInput.value || !passwordInput.value) {
            showError('Please fill in all fields');
            return;
        }
        
        try {
            // Show loading state
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            
            // Attempt login
            await api.auth.login({
                email: emailInput.value,
                password: passwordInput.value
            });
            
            // Redirect to dashboard on success
            window.location.href = 'dashboard.html';
        } catch (error) {
            showError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            // Reset button state
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });
    
    function showError(message) {
        errorMessageElement.textContent = message;
        errorMessageElement.classList.remove('hidden');
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessageElement.classList.add('hidden');
        }, 5000);
    }
});
