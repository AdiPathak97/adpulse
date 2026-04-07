import { useEffect, useState } from 'react';
import socket from '../services/socket';

const LiveIndicator = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    // reflect current state immediately
    setConnected(socket.connected);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="live-indicator">
      <span className={`live-dot ${connected ? 'live-dot--connected' : ''}`} />
      <span>{connected ? 'Live' : 'Connecting...'}</span>
    </div>
  );
};

export default LiveIndicator;