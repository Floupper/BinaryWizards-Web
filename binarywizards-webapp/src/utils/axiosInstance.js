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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
      const status = error.response.status;


      if (status === 401) {
        toast.error('Session expired, please login again.');


        setTimeout(() => {
          window.location.href = '/signin';
        }, 1000);


        localStorage.removeItem('token');
      } else {

        const errorMessage = error.response.data.error || error.response.data.message || error.message;
        // toast.error(`${errorMessage}`);
        throw new Error(`${errorMessage}`);
      }
    } else {

      toast.error('Network error :(');
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;