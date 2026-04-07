import api from './api';
import * as SecureStore from 'expo-secure-store';

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  await SecureStore.setItemAsync('token', data.token);
  return data.user;
};

export const registerUser = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  await SecureStore.setItemAsync('token', data.token);
  return data.user;
};

export const logoutUser = async () => {
  await SecureStore.deleteItemAsync('token');
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};