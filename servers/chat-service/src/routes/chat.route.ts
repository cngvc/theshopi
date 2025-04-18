import { chatSeedController } from '@chat/controllers/chat-seed.controller';
import { chatController } from '@chat/controllers/chat.controller';
import express, { Router } from 'express';

class ChatRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/conversations', chatController.getCurrentUserConversations);
    this.router.get('/conversations/latest', chatController.getCurrentUserLastConversation);
    this.router.get('/conversations/:conversationPublicId', chatController.getConversationByConversationPublicId);
    this.router.get('/conversations/:conversationPublicId/messages', chatController.getConversationMessages);
    this.router.post('/conversations', chatController.createConversation);
    this.router.post('/conversations/messages', chatController.sendMessage);
    this.router.put('/seed/:count', chatSeedController.createdSeeds);
    return this.router;
  }
}

export const chatRoutes = new ChatRoutes();
