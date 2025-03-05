import { chatController } from '@chat/controllers/chat.controller';
import express, { Router } from 'express';

class ChatRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/conversations', chatController.getCurrentUserConversations);
    this.router.post('/conversations/messages', chatController.sendMessage);
    this.router.post('/conversations', chatController.createConversation);
    this.router.get('/conversations/:conversationId', chatController.getConversationByConversationPublicId);
    this.router.get('/conversations/:conversationId/messages', chatController.getConversationMessages);
    return this.router;
  }
}

export const chatRoutes = new ChatRoutes();
