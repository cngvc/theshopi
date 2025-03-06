'use client';

import { socketClient } from '@/sockets/socket-client';
import { SocketEvents } from '@cngvc/shopi-shared-types';
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
    socketClient.socket.on(SocketEvents.MESSAGE_RECEIVED, (newMessage: any) => {
      queryClient.setQueryData(['messages', id], (prevMessages: any[] | undefined) => {
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
