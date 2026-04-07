import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.173:5000/api'
  // no withCredentials — RN doesn't use browser cookies
});

// attach token to every request
api.interceptors.request.use(async (config) => {
  const SecureStore = await import('expo-secure-store');
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;