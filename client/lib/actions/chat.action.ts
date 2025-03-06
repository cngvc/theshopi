'use server';

import { auth } from '@/auth';
import { IConversationDocument, IMessageDocument } from '@cngvc/shopi-shared';
import axiosInstance from '../axios';

export async function getConversationList() {
  const session = await auth();
  if (!session) throw new Error('User is not authenticated');
  const { data } = await axiosInstance.get('/chat/conversations/');
  const conversations: IMessageDocument[] = data.metadata?.conversations || [];
  return conversations;
}

export async function getConversationByConversationId(id: string) {
  const session = await auth();
  if (!session) throw new Error('User is not authenticated');
  const { data } = await axiosInstance.get(`/chat/conversations/${id}`);
  const conversation: IConversationDocument = data.metadata?.conversation;
  return conversation;
}

export async function getConversationMessages(id: string) {
  const session = await auth();
  if (!session) throw new Error('User is not authenticated');
  const { data } = await axiosInstance.get(`/chat/conversations/${id}/messages`);
  const messages: IMessageDocument[] = data.metadata?.messages;
  return messages;
}

export async function getLatestConversation() {
  const session = await auth();
  if (!session) throw new Error('User is not authenticated');
  const { data } = await axiosInstance.get('/chat/conversations/latest');
  const conversation: IMessageDocument = data.metadata?.conversations || [];
  return conversation;
}
