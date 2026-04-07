import { useEffect, useRef } from 'react';
import { getSocket } from '../services/socket';

const useWebSocket = (campaignIds = [], onMetricsUpdate) => {
  const joinedRooms = useRef(new Set());
  const callbackRef = useRef(onMetricsUpdate); // ← fix stale closure

  // keep ref current on every render
  useEffect(() => {
    callbackRef.current = onMetricsUpdate;
  }, [onMetricsUpdate]);

  useEffect(() => {
    let socketInstance;

    const setup = async () => {
      socketInstance = await getSocket();
      if (!socketInstance.connected) socketInstance.connect();

      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
        // re-join rooms on reconnect
        joinedRooms.current.forEach(id => {
          socketInstance.emit('join:campaign', id);
        });
      });

      socketInstance.on('metrics:update', ({ campaignId, metrics, spent }) => {
        callbackRef.current(campaignId, metrics, spent); // ← always calls latest callback
      });
    };

    setup();

    return () => {
      if (socketInstance) {
        joinedRooms.current.forEach(id => socketInstance.emit('leave:campaign', id));
        joinedRooms.current.clear();
        socketInstance.off('metrics:update');
        socketInstance.off('connect');
      }
    };
  }, []); // ← empty deps, runs once

  useEffect(() => {
    const join = async () => {
      const socketInstance = await getSocket();
      if (!socketInstance.connected) return;

      campaignIds.forEach(id => {
        if (!joinedRooms.current.has(id)) {
          socketInstance.emit('join:campaign', id);
          joinedRooms.current.add(id);
        }
      });
    };
    join();
  }, [campaignIds]);
};

export default useWebSocket;