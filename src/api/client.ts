import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Constants from 'expo-constants';
import { secureStorage } from '@/utils';

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'http://localhost:3000';
const API_TIMEOUT =
  Constants.expoConfig?.extra?.apiTimeout ||
  process.env.EXPO_PUBLIC_API_TIMEOUT ||
  10000;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(API_TIMEOUT as string, 10),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token when available
    const token = await secureStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error(
      '❌ Response Error:',
      error.response?.status,
      error.response?.data
    );

    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      console.log('Unauthorized - redirecting to login');
    } else if (error.response?.status === 403) {
      // Handle forbidden
      console.log('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.log('Server error occurred');
    }

    return Promise.reject(error);
  }
);

export default api;
