import axios, { InternalAxiosRequestConfig } from 'axios';
import { getStorageData } from '../storage';
import { API_URL } from '../../constants/url';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants/auth';

// const BASE_URL = 'https://be-final-project-bddr.onrender.com';
// axios.defaults.baseURL = BASE_URL;

const instanceAxios = axios.create({
  baseURL: 'https://27a1-113-160-225-96.ngrok-free.app',
  headers: {
    'Content-Type': 'ap plication/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 1000,
});

instanceAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url === API_URL.LOGIN) {
      return config;
    }

    if (config.url === API_URL.REFRESH_TOKEN) {
      const refreshToken = getStorageData(REFRESH_TOKEN);
      if (refreshToken) {
        config.headers['Authorization'] = `Bearer ${refreshToken}`;
      }

      return config;
    }

    const accessToken = getStorageData(ACCESS_TOKEN);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instanceAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN);
      console.log('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      window.location.href = `/login`;
    }

    return Promise.reject(error);
  },
);

export default instanceAxios;
