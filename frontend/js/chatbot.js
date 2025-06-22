import api from '../services/api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const suggestionChips = document.getElementById('suggestion-chips');
    const navMenu = document.getElementById('nav-menu');
    const suggestionLinks = document.querySelectorAll('.topic-link');
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Setup navigation based on login status
    setupNavigation();
    
    // Send message when Send button is clicked
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message when Enter key is pressed (but allow Shift+Enter for new lines)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Handle suggestion chips
    suggestionChips.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-chip')) {
            userInput.value = e.target.textContent;
            sendMessage();
        }
    });
    
    // Handle suggested topics
    suggestionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            userInput.value = this.textContent;
            sendMessage();
        });
    });
    
    // Functions
    function setupNavigation() {
        // Check if user is logged in
        const isLoggedIn = api.auth.isLoggedIn();
        
        // Create navigation links based on login status
        let navHTML = '';
        if (isLoggedIn) {
            navHTML = `
                <li><a href="dashboard.html">Dashboard</a></li>
                <li><a href="history.html">History</a></li>
                <li><a href="reports.html">Reports</a></li>
                <li><a href="chatbot.html" class="active">Health Assistant</a></li>
                <li><a href="#" id="logout-btn" class="logout-btn">Logout</a></li>
            `;
        } else {
            navHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="features.html">Features</a></li>
                <li><a href="tips.html">Tips</a></li>
                <li><a href="chatbot.html" class="active">Health Assistant</a></li>
                <li><a href="login.html" class="login-btn">Login</a></li>
            `;
        }
        
        navMenu.innerHTML = navHTML;
        
        // Add logout handler if logged in
        if (isLoggedIn) {
            document.getElementById('logout-btn').addEventListener('click', function() {
                api.auth.logout();
                window.location.href = 'index.html';
            });
        }
    }
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Clear input and reset height
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Call the AI API
        callGeminiAPI(message);
    }
    
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return typingDiv;
    }
    
    function removeTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    async function callGeminiAPI(message) {
        try {
            // In a real implementation, this would call the Gemini API
            // For now, we'll simulate a response with predefined answers
            
            // Wait 1-2 seconds to simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Get appropriate response
            const response = getHardcodedResponse(message);
            
            // Add bot response to chat
            addMessageToChat(response, 'bot');
            
        } catch (error) {
            console.error('Error calling AI API:', error);
            removeTypingIndicator();
            addMessageToChat("I'm sorry, I'm having trouble connecting right now. Please try again later.", 'bot');
        }
    }
    
    function getHardcodedResponse(message) {
        // Simple keyword matching for demo purposes
        message = message.toLowerCase();
        
        if (message.includes('period pain') || message.includes('cramp')) {
            return "For period pain relief, try these methods: 1) Apply a heating pad to your lower abdomen, 2) Take over-the-counter pain relievers like ibuprofen, 3) Stay hydrated, 4) Try gentle stretching or yoga, 5) Some find relief with herbal teas like ginger or chamomile. If your cramps are severe or debilitating, consider talking to a healthcare provider.";
        }
        
        if (message.includes('pms') || message.includes('mood swing')) {
            return "PMS symptoms can include mood swings, irritability, bloating, and fatigue. To manage them: 1) Track your symptoms to identify patterns, 2) Prioritize good sleep, 3) Exercise regularly, 4) Reduce caffeine and sugar, 5) Practice stress management through meditation or deep breathing. Calcium, vitamin B6, and magnesium supplements may also help some women.";
        }
        
        if (message.includes('irregular period') || message.includes('late period')) {
            return "Irregular periods can be caused by stress, weight changes, excessive exercise, hormonal imbalances, PCOS, or thyroid issues. Occasional irregularity is common, but if you experience consistently irregular periods, skipped periods, or significant changes to your cycle, it's best to consult with a healthcare provider to determine the cause.";
        }
        
        if (message.includes('exercise') || message.includes('workout')) {
            return "Exercise during your period is generally beneficial! It can help reduce cramps, boost mood, and improve energy. Light to moderate activities like walking, swimming, or yoga are excellent choices. If you're experiencing heavy flow or severe cramps, consider lower-intensity options. Always listen to your body and rest if needed - there's no shame in modifying your routine during your period.";
        }
        
        if (message.includes('diet') || message.includes('food') || message.includes('eat')) {
            return "During your period, focus on iron-rich foods like leafy greens, lean meats, and legumes to replenish iron lost through bleeding. Incorporate anti-inflammatory foods such as berries, fatty fish, and nuts to help with cramps. Stay hydrated and limit salt to reduce bloating. Some find that reducing caffeine, alcohol, and sugar helps ease PMS symptoms. Small, frequent meals can help maintain energy levels.";
        }
        
        if (message.includes('thank')) {
            return "You're welcome! I'm here to help anytime you have questions about menstrual or reproductive health.";
        }
        
        // Default response
        return "Thank you for your question. While I'm designed to provide information about menstrual health, I'm still learning. For the most accurate advice, consider speaking with a healthcare provider. Is there something specific about menstrual health you'd like to know more about?";
    }
});
