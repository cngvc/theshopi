'use server';

import { auth } from '@/auth';
import { IConversationDocument, IMessageDocument, sendMessageSchema } from '@cngvc/shopi-shared-types';
import { notFound } from 'next/navigation';
import axiosInstance from '../axios';

export async function getConversationList() {
  try {
    const session = await auth();
    if (!session) notFound();
    const { data } = await axiosInstance.get('/chat/conversations/');
    const conversations: IConversationDocument[] = data.metadata?.conversations || [];
    return conversations;
  } catch (error) {
    return [];
  }
}

export async function getConversationByConversationId(id: string) {
  const session = await auth();
  if (!session) notFound();
  const { data } = await axiosInstance.get(`/chat/conversations/${id}`);
  const conversation: IConversationDocument = data.metadata?.conversation;
  return conversation;
}

export async function getConversationMessages(id: string) {
  const session = await auth();
  if (!session) notFound();
  const { data } = await axiosInstance.get(`/chat/conversations/${id}/messages`);
  const messages: IMessageDocument[] = data.metadata?.messages;
  return messages;
}

export async function getLatestConversation() {
  try {
    const session = await auth();
    if (!session) notFound();
    const { data } = await axiosInstance.get('/chat/conversations/latest');
    const conversation: IConversationDocument = data.metadata?.conversations || [];
    return conversation;
  } catch (error) {
    return null;
  }
}

export async function sendMessage(payload: IMessageDocument) {
  const session = await auth();
  if (!session) notFound();
  const { error, value } = sendMessageSchema.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const { data } = await axiosInstance.post('/chat/conversations/messages', value);
  const message: IMessageDocument = data.metadata?.message || [];
  return message;
}
