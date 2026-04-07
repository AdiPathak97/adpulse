import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const SOCKET_URL = 'http://192.168.0.173:5000';

let socket = null;

export const getSocket = async () => {
  if (socket) return socket;

  const token = await SecureStore.getItemAsync('token');

  socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: { token }  // RN passes token here instead of cookie
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};