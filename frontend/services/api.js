const API_URL = 'http://localhost:5000/api';

// Helper for making authenticated requests
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Authentication APIs
const auth = {
  register: async (userData) => {
    const data = await authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
  
  login: async (credentials) => {
    const data = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getUser: async () => {
    return await authFetch('/auth/me');
  },
  
  isLoggedIn: () => {
    return localStorage.getItem('token') !== null;
  }
};

// Period tracking APIs
const period = {
  savePeriodData: async (periodData) => {
    return await authFetch('/period', {
      method: 'POST',
      body: JSON.stringify(periodData)
    });
  },
  
  getLatestPeriod: async () => {
    return await authFetch('/period/latest');
  },
  
  predictNextPeriod: async () => {
    return await authFetch('/period/predict');
  }
};

// Symptom tracking APIs
const symptoms = {
  saveSymptom: async (symptomData) => {
    return await authFetch('/symptoms', {
      method: 'POST',
      body: JSON.stringify(symptomData)
    });
  },
  
  getSymptoms: async (startDate, endDate) => {
    let url = '/symptoms';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return await authFetch(url);
  },
  
  getSymptomById: async (id) => {
    return await authFetch(`/symptoms/${id}`);
  },
  
  deleteSymptom: async (id) => {
    return await authFetch(`/symptoms/${id}`, {
      method: 'DELETE'
    });
  }
};

const api = {
  auth,
  period,
  symptoms
};

window.api = api; // Expose API for debugging

export default api;
