import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// don't connect immediately — we connect manually after auth
const socket = io(SOCKET_URL, {
  withCredentials: true,  // sends httpOnly cookie for auth handshake
  autoConnect: false
});

export default socket;