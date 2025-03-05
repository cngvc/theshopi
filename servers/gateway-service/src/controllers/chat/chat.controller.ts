import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { chatService } from '@gateway/services/api/chat.service';
import { Request, Response } from 'express';

class ChatController {
  getCurrentUserConversations = async (req: Request, res: Response) => {
    const response = await chatService.getCurrentUserConversations();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  getConversationByConversationPublicId = async (req: Request, res: Response) => {
    const response = await chatService.getConversationByConversationPublicId(req.params.conversationId);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  getConversationMessages = async (req: Request, res: Response) => {
    const response = await chatService.getConversationMessages(req.params.conversationId);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  createConversation = async (req: Request, res: Response) => {
    const response = await chatService.createConversation(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  sendMessage = async (req: Request, res: Response) => {
    const response = await chatService.sendMessage(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
}

export const chatController = new ChatController();
