import api from '../services/api.js';

document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.getElementById('register-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageElement = document.getElementById('error-message');
    
    // Check if user is already logged in
    if (api.auth.isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
    
    registerBtn.addEventListener('click', async function() {
        // Basic validation
        if (!nameInput.value || !emailInput.value || !passwordInput.value) {
            showError('Please fill in all fields');
            return;
        }
        
        if (passwordInput.value.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }
        
        try {
            // Show loading state
            registerBtn.disabled = true;
            registerBtn.textContent = 'Creating account...';
            
            // Attempt registration
            await api.auth.register({
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            });
            
            // Redirect to dashboard on success
            window.location.href = 'dashboard.html';
        } catch (error) {
            showError(error.message || 'Registration failed');
        } finally {
            // Reset button state
            registerBtn.disabled = false;
            registerBtn.textContent = 'Register';
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
