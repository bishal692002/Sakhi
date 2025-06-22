import api from '../services/api.js';

document.addEventListener('DOMContentLoaded', function() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterBtn = document.getElementById('filter-btn');
    const historyList = document.getElementById('history-list');
    const noDataMessage = document.getElementById('no-data');
    
    // Set initial date range (last 3 months)
    const today = new Date();
    endDateInput.value = today.toISOString().split('T')[0];
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    startDateInput.value = threeMonthsAgo.toISOString().split('T')[0];
    
    // Load initial data
    loadHistoryData();
    
    // Event listeners
    filterBtn.addEventListener('click', loadHistoryData);
    
    async function loadHistoryData() {
        try {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            
            // Show loading state
            historyList.innerHTML = '<div class="loading">Loading your history...</div>';
            
            // Get period data
            const response = await api.period.getHistory(startDate.toISOString(), endDate.toISOString());
            
            if (response.success && response.data.length > 0) {
                displayHistoryData(response.data);
                noDataMessage.classList.add('hidden');
            } else {
                historyList.innerHTML = '';
                noDataMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error loading history:', error);
            historyList.innerHTML = `
                <div class="error-message">
                    Error loading history. Please try again.
                </div>
            `;
        }
    }
    
    function displayHistoryData(periods) {
        historyList.innerHTML = '';
        
        periods.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .forEach(period => {
                const template = document.querySelector('.history-template').cloneNode(true);
                const historyItem = template.querySelector('.history-item');
                
                const date = new Date(period.startDate);
                historyItem.querySelector('.month').textContent = 
                    date.toLocaleString('default', { month: 'short' });
                historyItem.querySelector('.day').textContent = 
                    date.getDate();
                historyItem.querySelector('.year').textContent = 
                    date.getFullYear();
                
                historyItem.querySelector('.cycle-length').textContent = 
                    period.cycleLength;
                historyItem.querySelector('.period-length').textContent = 
                    period.periodLength;
                
                historyList.appendChild(historyItem);
                historyItem.classList.add('fade-in');
            });
    }
});
