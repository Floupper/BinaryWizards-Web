import axios from 'axios';
import { toast } from "react-toastify";
import config from '../config';

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token_id = localStorage.getItem('token_id');
    if (token_id) {
      config.headers['Authorization'] = `Bearer ${token_id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast.error(`Error: ${error.response.data.message || error.message}`);
    } else {
      toast.error('Network error. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;