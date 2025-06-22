import api from '../services/api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Chart initialization
    const cycleCtx = document.getElementById('cycleChart').getContext('2d');
    const symptomsCtx = document.getElementById('symptomsChart').getContext('2d');
    const moodCtx = document.getElementById('moodChart').getContext('2d');
    
    // Load data and initialize charts
    loadUserData();
    
    async function loadUserData() {
        try {
            // Get last 6 months of data
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6);
            
            const [periodData, symptomsData] = await Promise.all([
                api.period.getLatestPeriod(),
                api.symptoms.getSymptoms(startDate.toISOString(), endDate.toISOString())
            ]);
            
            if (periodData.success && symptomsData.success) {
                initializeCycleChart(cycleCtx, periodData.data);
                initializeSymptomsChart(symptomsCtx, symptomsData.data);
                initializeMoodChart(moodCtx, symptomsData.data);
                updateStatistics(periodData.data, symptomsData.data);
            } else {
                showNoData();
            }
        } catch (error) {
            console.error('Error loading report data:', error);
            showNoData();
        }
    }
    
    function initializeCycleChart(ctx, data) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: generateLastSixMonths(),
                datasets: [{
                    label: 'Cycle Length',
                    data: calculateCycleLengths(data),
                    borderColor: '#d14d72',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cycle Length Over Time'
                    }
                },
                scales: {
                    y: {
                        min: 20,
                        max: 45
                    }
                }
            }
        });
    }
    
    function initializeSymptomsChart(ctx, data) {
        const symptomCounts = countSymptoms(data);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(symptomCounts),
                datasets: [{
                    label: 'Frequency',
                    data: Object.values(symptomCounts),
                    backgroundColor: '#ffb4b4'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Common Symptoms'
                    }
                }
            }
        });
    }
    
    function initializeMoodChart(ctx, data) {
        const moodData = analyzeMoodPatterns(data);
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(moodData),
                datasets: [{
                    data: Object.values(moodData),
                    backgroundColor: [
                        '#FFB4B4',
                        '#D14D72',
                        '#8A2BE2',
                        '#FFC0CB',
                        '#FF69B4',
                        '#DB7093'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Mood Distribution'
                    }
                }
            }
        });
    }
    
    function updateStatistics(periodData, symptomsData) {
        // Update cycle statistics
        document.getElementById('avg-cycle-length').textContent = 
            calculateAverageCycleLength(periodData);
        document.getElementById('min-cycle-length').textContent = 
            findMinCycleLength(periodData);
        document.getElementById('max-cycle-length').textContent = 
            findMaxCycleLength(periodData);
            
        // Update symptom statistics
        const commonSymptom = findMostCommonSymptom(symptomsData);
        const commonMood = findMostCommonMood(symptomsData);
        
        document.getElementById('common-symptom').textContent = 
            formatSymptomName(commonSymptom);
        document.getElementById('common-mood').textContent = 
            formatMoodName(commonMood);
    }
    
    function showNoData() {
        document.querySelector('.reports-grid').style.display = 'none';
        document.getElementById('no-data-reports').classList.remove('hidden');
    }
    
    // Helper functions
    function generateLastSixMonths() {
        const months = [];
        const today = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(today.getMonth() - i);
            months.push(d.toLocaleString('default', { month: 'short' }));
        }
        
        return months;
    }
    
    function calculateCycleLengths(data) {
        // Implementation for calculating cycle lengths
        return data.map(period => period.cycleLength);
    }
    
    function countSymptoms(data) {
        const counts = {};
        data.forEach(day => {
            Object.keys(day).forEach(symptom => {
                if (['headache', 'backache', 'bloating'].includes(symptom) && day[symptom]) {
                    counts[symptom] = (counts[symptom] || 0) + 1;
                }
            });
        });
        return counts;
    }
    
    function analyzeMoodPatterns(data) {
        const moodCounts = {};
        data.forEach(day => {
            if (day.mood) {
                moodCounts[day.mood] = (moodCounts[day.mood] || 0) + 1;
            }
        });
        return moodCounts;
    }
    
    function formatSymptomName(symptom) {
        return symptom.charAt(0).toUpperCase() + 
            symptom.slice(1).replace('_', ' ');
    }
    
    function formatMoodName(mood) {
        return mood.charAt(0).toUpperCase() + 
            mood.slice(1).replace('_', ' ');
    }
});
