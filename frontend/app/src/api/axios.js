import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://microcourses-2ise.onrender.com/api',
  withCredentials: true
});

// 🔹 Attach token from localStorage to Authorization header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

