'use server';

import { auth } from '@/auth';
import { IConversationDocument, IMessageDocument, sendMessageSchema } from '@cngvc/shopi-shared-types';
import { redirect } from 'next/navigation';
import axiosInstance from '../axios';
import pages from '../constants/pages';

export async function getConversationList() {
  try {
    const session = await auth();
    if (!session) redirect(pages.signin);
    const { data } = await axiosInstance.get('/chat/conversations/');
    const conversations: IConversationDocument[] = data.metadata?.conversations || [];
    return conversations;
  } catch (error) {
    return [];
  }
}

export async function getConversationByConversationPublicId(id: string) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosInstance.get(`/chat/conversations/${id}`);
  const conversation: IConversationDocument = data.metadata?.conversation;
  return conversation;
}

export async function getConversationMessages(id: string) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosInstance.get(`/chat/conversations/${id}/messages`);
  const messages: IMessageDocument[] = data.metadata?.messages;
  return messages;
}

export async function getCurrentUserLastConversation() {
  try {
    const session = await auth();
    if (!session) redirect(pages.signin);
    const { data } = await axiosInstance.get('/chat/conversations/latest');
    const conversation: IConversationDocument = data.metadata?.conversation || null;
    return conversation;
  } catch (error) {
    return null;
  }
}

export async function sendMessage(payload: { conversationPublicId?: string; receiverAuthId?: string; body: string }) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { error, value } = sendMessageSchema.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const { data } = await axiosInstance.post('/chat/conversations/messages', value);
  const message: IMessageDocument = data.metadata?.message || [];
  return message;
}

export async function chatWithStore(payload: { receiverAuthId: string }) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  if (!payload.receiverAuthId) {
    throw new Error('Receiver id is required');
  }
  const { data } = await axiosInstance.post('/chat/conversations', { receiverAuthId: payload.receiverAuthId });
  const conversation: IConversationDocument = data.metadata?.conversation;
  return conversation;
}
