import { useEffect, useRef } from 'react';
import socket from '../services/socket';
import { useCampaigns } from '../context/CampaignContext';

const useWebSocket = (campaignIds = []) => {
  const { updateCampaignMetrics } = useCampaigns();
  const joinedRooms = useRef(new Set()); // track which rooms we're in

  useEffect(() => {
    // connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log('Socket connected:', socket.id);
      // re-join all rooms on reconnect
      joinedRooms.current.forEach(id => {
        socket.emit('join:campaign', id);
      });
    };

    const onMetricsUpdate = ({ campaignId, metrics, spent }) => {
      updateCampaignMetrics(campaignId, metrics, spent);
    };

    const onError = (err) => {
      console.error('Socket error:', err.message);
    };

    socket.on('connect', onConnect);
    socket.on('metrics:update', onMetricsUpdate);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('metrics:update', onMetricsUpdate);
      socket.off('error', onError);
    };
  }, [updateCampaignMetrics]);

  // join/leave rooms as campaignIds list changes
  useEffect(() => {
    if (!socket.connected) return;

    const current = new Set(campaignIds);
    const joined = joinedRooms.current;

    // join new rooms
    current.forEach(id => {
      if (!joined.has(id)) {
        socket.emit('join:campaign', id);
        joined.add(id);
      }
    });

    // leave removed rooms
    joined.forEach(id => {
      if (!current.has(id)) {
        socket.emit('leave:campaign', id);
        joined.delete(id);
      }
    });
  }, [campaignIds]);

  // cleanup on unmount — disconnect and leave all rooms
  useEffect(() => {
    return () => {
      joinedRooms.current.forEach(id => {
        socket.emit('leave:campaign', id);
      });
      joinedRooms.current.clear();
      socket.disconnect();
    };
  }, []);
};

export default useWebSocket;