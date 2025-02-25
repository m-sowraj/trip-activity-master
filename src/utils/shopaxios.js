import axios from 'axios';

// Create axios instance with base URL
const shopAxios = axios.create({
  baseURL: 'https://fourtrip-server.onrender.com/api',
  timeout: 10000,
});

// Add request interceptor to add token to all requests
shopAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_partner_shop');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle unauthorized responses
shopAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized responses
      if (error.response.status === 401) {
        // Clear local storage
        localStorage.removeItem('token_partner_shop');
        localStorage.removeItem('token_partner_shop');
        
        // Redirect to login page
        window.location.href = '/login';
      }
      
      // Return error message from response if available
      return Promise.reject(error.response.data || error.message);
    }
    
    // Handle network errors or other issues
    return Promise.reject(error.message);
  }
);

export default shopAxios;