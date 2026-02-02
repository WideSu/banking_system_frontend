import axios from 'axios';

// Use relative path to leverage Vite proxy in development
// In production, you might want to set VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
