import api from '../services/api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const userNameElement = document.getElementById('user-name');
    const lastPeriodInput = document.getElementById('last-period');
    const cycleLengthInput = document.getElementById('cycle-length');
    const periodLengthInput = document.getElementById('period-length');
    const saveDataBtn = document.getElementById('save-data-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const predictedDateElement = document.getElementById('predicted-date');
    const fertileWindowElement = document.getElementById('fertile-window');
    const resultsSection = document.getElementById('results-section');
    const periodTip = document.getElementById('period-tip');
    const errorMessageElement = document.getElementById('error-message');

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

    // Check authentication
    if (!api.auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Set today as max date for last period input
    const today = new Date();
    lastPeriodInput.max = today.toISOString().split('T')[0];
    
    // Set default date to today
    lastPeriodInput.value = today.toISOString().split('T')[0];

    // Load user data
    loadUserData();

    // Load latest period data
    loadPeriodData();

    // Set event listeners
    saveDataBtn.addEventListener('click', saveUserPeriodData);
    logoutBtn.addEventListener('click', handleLogout);

    // Functions
    async function loadUserData() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            userNameElement.textContent = user.name;
        } catch (error) {
            console.error('Error loading user data:', error);
            showError('Error loading user data. Please refresh the page.');
        }
    }

    async function loadPeriodData() {
        try {
            const data = await api.period.getLatestPeriod();
            if (data.success && data.data) {
                const periodData = data.data;
                lastPeriodInput.value = new Date(periodData.startDate).toISOString().split('T')[0];
                cycleLengthInput.value = periodData.cycleLength;
                periodLengthInput.value = periodData.periodLength;
                
                // Get predictions
                await getPredictions();
            }
        } catch (error) {
            // Likely first time user with no period data
            console.log('No period data found:', error);
        }
    }

    async function saveUserPeriodData() {
        try {
            // Validate inputs
            const lastPeriodDate = new Date(lastPeriodInput.value);
            const cycleLength = parseInt(cycleLengthInput.value);
            const periodLength = parseInt(periodLengthInput.value);

            if (isNaN(lastPeriodDate.getTime())) {
                showError("Please enter a valid date");
                return;
            }

            if (cycleLength < 21 || cycleLength > 45) {
                showError("Please enter a cycle length between 21 and 45 days");
                return;
            }

            if (periodLength < 1 || periodLength > 10) {
                showError("Please enter a period length between 1 and 10 days");
                return;
            }

            // Show loading state
            saveDataBtn.disabled = true;
            saveDataBtn.textContent = 'Saving...';

            // Save to API
            await api.period.savePeriodData({
                startDate: lastPeriodDate.toISOString(),
                cycleLength,
                periodLength
            });

            // Get predictions
            await getPredictions();

            saveDataBtn.textContent = 'Data Saved!';
            setTimeout(() => {
                saveDataBtn.textContent = 'Save Data';
                saveDataBtn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Error saving period data:', error);
            showError(error.message || 'Error saving period data');
            saveDataBtn.disabled = false;
            saveDataBtn.textContent = 'Save Data';
        }
    }

    async function getPredictions() {
        try {
            const data = await api.period.predictNextPeriod();
            if (data.success) {
                const predictions = data.data;
                
                // Format next period date
                const nextPeriodDate = new Date(predictions.nextPeriod.startDate);
                const options = { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                };
                const formattedDate = nextPeriodDate.toLocaleDateString(undefined, options);
                
                // Format fertile window
                const fertileStart = new Date(predictions.fertileWindow.startDate);
                const fertileEnd = new Date(predictions.fertileWindow.endDate);
                const formattedFertileStart = fertileStart.toLocaleDateString(undefined, {
                    month: 'long', day: 'numeric'
                });
                const formattedFertileEnd = fertileEnd.toLocaleDateString(undefined, {
                    month: 'long', day: 'numeric'
                });
                
                // Display results
                predictedDateElement.textContent = formattedDate;
                fertileWindowElement.textContent = `${formattedFertileStart} - ${formattedFertileEnd}`;
                
                // Display random tip
                const randomTip = tips[Math.floor(Math.random() * tips.length)];
                periodTip.textContent = randomTip;
                
                // Show results section
                resultsSection.classList.remove('hidden');
                
                // Smooth scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error getting predictions:', error);
        }
    }

    function handleLogout() {
        api.auth.logout();
        window.location.href = 'index.html';
    }

    function showError(message) {
        errorMessageElement.textContent = message;
        errorMessageElement.classList.remove('hidden');
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessageElement.classList.add('hidden');
        }, 5000);
    }
});
