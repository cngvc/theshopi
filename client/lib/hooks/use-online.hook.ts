'use client';

import { socketClient } from '@/sockets/socket-client';
import { SocketEvents } from '@cngvc/shopi-shared-types';
import { useEffect, useState } from 'react';

export const useOnline = () => {
  const [onlineUsers, $onlineUsers] = useState<string[]>([]);
  useEffect(() => {
    socketClient.socket.emit(SocketEvents.GET_LOGGED_IN_USERS);
    socketClient.socket.on(SocketEvents.USER_ONLINE, (_onlineUsers: string[]) => {
      console.log(`🟢 Receiving user online list ${_onlineUsers.length}`);
      $onlineUsers(_onlineUsers);
    });
    return () => {
      socketClient.socket.off(SocketEvents.MESSAGE_RECEIVED);
    };
  }, []);

  return { onlineUsers };
};
