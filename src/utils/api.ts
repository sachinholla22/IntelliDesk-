import axios, { AxiosResponse } from 'axios';
import { ApiWrapper } from '../types';

const  APIbaseURL= 'http://localhost:8080'
const api = axios.create({
  baseURL:APIbaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log("api log",APIbaseURL);
// localStorage.setItem("token", response.data.token);
// localStorage.setItem("user", JSON.stringify(response.data.user));
// // Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Making API request to:', config.url);
    console.log('Token exists:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't override Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const handleApiResponse = <T>(response: AxiosResponse): T => {
  console.log('Handling API response:', response.data);
  
  // Handle your ApiWrapper format
  if (response.data && typeof response.data === 'object') {
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    } else if (response.data.error) {
      throw new Error(response.data.error.message || 'Request failed');
    } else if (response.data.success === false) {
      throw new Error(response.data.message || 'Request failed');
    }
  }
  
  // If it's not wrapped, return as is
  return response.data;
};

export default api;