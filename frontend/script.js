document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const predictBtn = document.getElementById('predict-btn');
    const lastPeriodInput = document.getElementById('last-period');
    const cycleLengthInput = document.getElementById('cycle-length');
    const predictedDateElement = document.getElementById('predicted-date');
    const resultsSection = document.getElementById('results-section');
    const periodTip = document.getElementById('period-tip');

    // Set today as max date for last period input
    const today = new Date();
    lastPeriodInput.max = today.toISOString().split('T')[0];
    
    // Set default date to today
    lastPeriodInput.value = today.toISOString().split('T')[0];

    // Tips array
    const tips = [
        "Drink plenty of water and stay hydrated before your cycle begins.",
        "Gentle yoga may help reduce cramps and discomfort.",
        "A heating pad can provide relief for menstrual cramps.",
        "Include iron-rich foods in your diet to combat fatigue.",
        "Track your mood changes to better understand your cycle patterns.",
        "Consider taking calcium supplements to reduce PMS symptoms.",
        "Avoid caffeine and salty foods to reduce bloating before your period.",
        "Getting enough sleep can help manage menstrual symptoms better."
    ];

    // Handle form submission
    predictBtn.addEventListener('click', function() {
        // Get input values
        const lastPeriodDate = new Date(lastPeriodInput.value);
        const cycleLength = parseInt(cycleLengthInput.value);

        // Validate inputs
        if (isNaN(lastPeriodDate.getTime())) {
            alert("Please enter a valid date");
            return;
        }

        if (cycleLength < 21 || cycleLength > 45) {
            alert("Please enter a cycle length between 21 and 45 days");
            return;
        }

        // Calculate next period date
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(lastPeriodDate.getDate() + cycleLength);

        // Format date for display (e.g., "Monday, June 28, 2025")
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = nextPeriodDate.toLocaleDateString(undefined, options);

        // Display result
        predictedDateElement.textContent = formattedDate;

        // Display random tip
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        periodTip.textContent = randomTip;

        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Smooth scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });
});