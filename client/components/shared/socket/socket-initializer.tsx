'use client';

import { useAuth } from '@/lib/hooks/use-auth-id.hook';
import { socketClient } from '@/sockets/socket-client';
import { SocketEvents } from '@cngvc/shopi-types';
import { useThrottle } from '@uidotdev/usehooks';
import { useCallback, useEffect } from 'react';

export default function SocketInitializer() {
  const { id } = useAuth();
  const throttledId = useThrottle(id, 5000);

  useEffect(() => {
    if (throttledId) {
      console.log('🟢 User online: ', socketClient.socket.connected);
      socketClient.socket.emit(SocketEvents.LOGGED_IN_USERS, throttledId);
    }
  }, [throttledId]);

  const emitUserOffline = useCallback(() => {
    if (id) {
      console.log('🔴 User offline: ', socketClient.socket.connected);
      socketClient.socket.emit(SocketEvents.REMOVE_LOGGED_IN_USERS, id);
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      emitUserOffline();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [emitUserOffline]);

  return <div className="check-online hidden" />;
}
