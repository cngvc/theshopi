'use client';

import { socketClient } from '@/sockets/socket-client';
import { IMessageDocument, SocketEvents } from '@cngvc/shopi-shared-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getConversationMessages } from '../actions/chat.action';

export const useMessages = (id?: string | null) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => getConversationMessages(id!),
    enabled: !!id
  });

  useEffect(() => {
    if (id) socketClient.socket.emit(SocketEvents.USER_JOIN_ROOM, id);
    return () => {
      if (id) socketClient.socket.emit(SocketEvents.USER_LEFT_ROOM, id);
    };
  }, [id]);

  useEffect(() => {
    socketClient.socket.on(SocketEvents.MESSAGE_RECEIVED, (newMessage: IMessageDocument) => {
      console.log(`📥 Receiving new message from ${newMessage.senderUsername}`);
      queryClient.setQueryData(['messages', id], (prevMessages: IMessageDocument[] | undefined) => {
        if (newMessage.conversationId === id) {
          return prevMessages ? [...prevMessages, newMessage] : [newMessage];
        }
      });
    });
    return () => {
      socketClient.socket.off(SocketEvents.MESSAGE_RECEIVED);
    };
  }, [queryClient]);

  return { data, isLoading };
};
