'use server';

import { auth } from '@/auth';
import { IConversationDocument, IMessageDocument, sendMessageSchema } from '@cngvc/shopi-types';
import { redirect } from 'next/navigation';
import { safeApiCall, unsafeApiCall } from '../axios-helper';
import axiosPrivateInstance from '../axios-private';
import pages from '../constants/pages';

export async function getConversationList() {
  return await safeApiCall(async () => {
    const { data } = await axiosPrivateInstance.get('/chat/conversations/');
    const conversations: IConversationDocument[] = data.metadata?.conversations || [];
    return conversations;
  });
}

export async function getConversationByConversationPublicId(id: string) {
  return await safeApiCall(async () => {
    const { data } = await axiosPrivateInstance.get(`/chat/conversations/${id}`);
    const conversation: IConversationDocument = data.metadata?.conversation;
    return conversation;
  });
}

export async function getConversationMessages(id: string) {
  return await safeApiCall(async () => {
    const { data } = await axiosPrivateInstance.get(`/chat/conversations/${id}/messages`);
    const messages: IMessageDocument[] = data.metadata?.messages;
    return messages;
  });
}

export async function getCurrentUserLastConversation() {
  return await unsafeApiCall(async () => {
    const { data } = await axiosPrivateInstance.get('/chat/conversations/latest');
    const conversation: IConversationDocument = data.metadata?.conversation || null;
    return conversation;
  });
}

export async function sendMessage(payload: { conversationPublicId?: string; receiverAuthId?: string; body: string }) {
  return await safeApiCall(async () => {
    const { error, value } = sendMessageSchema.validate(payload);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await axiosPrivateInstance.post('/chat/conversations/messages', value);
  });
}

export async function chatWithStore(payload: { receiverAuthId: string }) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  return await safeApiCall(async () => {
    if (!payload.receiverAuthId) {
      throw new Error('Receiver id is required');
    }
    const { data } = await axiosPrivateInstance.post('/chat/conversations', { receiverAuthId: payload.receiverAuthId });
    const conversation: IConversationDocument = data.metadata?.conversation;
    return conversation;
  });
}
