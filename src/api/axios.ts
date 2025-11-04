import axios, { AxiosInstance } from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response.data, // only return useful data
  (error) => {
    // Handle global errors here
    if (error.response?.status === 401) {
      console.warn('Unauthorized — maybe redirect to login');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
