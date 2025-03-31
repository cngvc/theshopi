'use client';

import { socketClient } from '@/sockets/socket-client';
import { IMessageDocument, SocketEvents } from '@cngvc/shopi-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getConversationMessages } from '../actions/chat.action';
import queryKeys from '../constants/query-keys';

export const useMessages = (id?: string | null) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.messages, id],
    queryFn: () => getConversationMessages(id!),
    enabled: !!id,
    initialData: []
  });

  useEffect(() => {
    if (id) socketClient.socket.emit(SocketEvents.USER_JOIN_ROOM, id);
    return () => {
      if (id) socketClient.socket.emit(SocketEvents.USER_LEFT_ROOM, id);
    };
  }, [id]);

  useEffect(() => {
    socketClient.socket.on(SocketEvents.MESSAGE_RECEIVED, (newMessage: IMessageDocument) => {
      console.log(`📥 Receiving new message from ${newMessage.senderAuthId}`);
      queryClient.setQueryData(['messages', id], (prevMessages: IMessageDocument[] | undefined) => {
        if (newMessage.conversationPublicId === id) {
          return prevMessages ? [...prevMessages, newMessage] : [newMessage];
        }
      });
    });
    return () => {
      socketClient.socket.off(SocketEvents.MESSAGE_RECEIVED);
    };
  }, [id, queryClient]);

  return { data, isLoading };
};
