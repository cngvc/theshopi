'use client';

import { SocketEvents } from '@/lib/constants/socket-events';
import { socketClient } from '@/sockets/socket-client';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { useThrottle } from 'react-use';

export default function SocketInitializer() {
  const session = useSession();
  const throttledUsername = useThrottle(session.data?.user?.username, 5000);

  useEffect(() => {
    if (throttledUsername) {
      console.log('🟢 User online: ', socketClient.socket.connected);
      socketClient.socket.emit(SocketEvents.LOGGED_IN_USERS, throttledUsername);
    }
  }, [throttledUsername]);

  const emitUserOffline = useCallback(() => {
    const username = session.data?.user?.username;
    if (username) {
      console.log('🔴 User offline: ', socketClient.socket.connected);
      socketClient.socket.emit(SocketEvents.REMOVE_LOGGED_IN_USERS, username);
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
