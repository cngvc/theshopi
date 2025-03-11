'use client';

import { socketClient } from '@/sockets/socket-client';
import { SocketEvents } from '@cngvc/shopi-shared-types';
import { useThrottle } from '@uidotdev/usehooks';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';

export default function SocketInitializer() {
  const session = useSession();
  const throttledId = useThrottle(session.data?.user?.id, 5000);

  useEffect(() => {
    if (throttledId) {
      console.log('🟢 User online: ', socketClient.socket.connected);
      socketClient.socket.emit(SocketEvents.LOGGED_IN_USERS, throttledId);
    }
  }, [throttledId]);

  const emitUserOffline = useCallback(() => {
    const id = session.data?.user?.id;
    if (id) {
      console.log('🔴 User offline: ', socketClient.socket.connected);
      socketClient.socket.emit(SocketEvents.REMOVE_LOGGED_IN_USERS, id);
    }
  }, [session.data?.user]);

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
