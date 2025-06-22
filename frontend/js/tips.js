document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tipCards = document.querySelectorAll('.tip-card');
    
    // Add event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter tips based on selected category
            filterTips(this.dataset.category);
        });
    });
    
    // Function to filter tips
    function filterTips(category) {
        tipCards.forEach(card => {
            const categories = card.dataset.categories.split(' ');
            
            if (category === 'all' || categories.includes(category)) {
                card.style.display = 'block';
                // Add animation
                card.classList.add('fade-in');
                setTimeout(() => {
                    card.classList.remove('fade-in');
                }, 500);
            } else {
                card.style.display = 'none';
            }
        });
    }
});
