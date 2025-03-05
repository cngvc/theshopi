'use client';

import { SocketEvents } from '@/lib/constants/socket-events';
import { socketClient } from '@/sockets/socket-client';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';

export default function WebSocketInitializer() {
  const session = useSession();

  const emitUserOnline = useCallback(() => {
    const username = session.data?.user?.username;
    if (username) socketClient.socket.emit(SocketEvents.LOGGED_IN_USERS, username);
  }, [session.data?.user]);

  const emitUserOffline = useCallback(() => {
    const username = session.data?.user?.username;
    if (username) socketClient.socket.emit(SocketEvents.REMOVE_LOGGED_IN_USERS, username);
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

  useEffect(() => {
    emitUserOnline();
  }, [emitUserOnline]);

  return null;
}
