import axios from 'axios';
import { Platform } from 'react-native';

// standard development machine local IP to support simulators and physical devices
const API_URL = 'http://192.168.2.11:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

