import { IConversationDocument, IMessageDocument } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class ChatService extends AxiosService {
  constructor() {
    super(`${config.CHAT_BASE_URL}/api/v1/chat`, 'message');
  }
  getCurrentUserConversations = async () => {
    const response: AxiosResponse = await this.get('/conversations/');
    return response;
  };
  getCurrentUserLastConversation = async () => {
    const response: AxiosResponse = await this.get('/conversations/latest');
    return response;
  };
  getConversationByConversationId = async (conversationId: string) => {
    const response: AxiosResponse = await this.get(`/conversations/${conversationId}`);
    return response;
  };
  getConversationMessages = async (conversationId: string) => {
    const response: AxiosResponse = await this.get(`/conversations/${conversationId}/messages`);
    return response;
  };
  createConversation = async (payload: IConversationDocument) => {
    const response: AxiosResponse = await this.post(`/conversations`, payload);
    return response;
  };
  sendMessage = async (payload: IMessageDocument) => {
    const response: AxiosResponse = await this.post(`/conversations/messages`, payload);
    return response;
  };

  createSeeds = async (count: string): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.put(`/seed/${count}`);
    return response;
  };
}

export const chatService = new ChatService();
