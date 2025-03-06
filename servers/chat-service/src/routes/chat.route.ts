import { chatSeedController } from '@chat/controllers/chat-seed.controller';
import { chatController } from '@chat/controllers/chat.controller';
import { AuthMiddleware } from '@cngvc/shopi-shared';
import express, { Router } from 'express';

class ChatRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.use(AuthMiddleware.checkAuthentication);
    this.router.get('/conversations', chatController.getCurrentUserConversations);
    this.router.get('/conversations/latest', chatController.getCurrentUserLastConversation);
    this.router.get('/conversations/:conversationId', chatController.getConversationByConversationId);
    this.router.get('/conversations/:conversationId/messages', chatController.getConversationMessages);
    this.router.post('/conversations', chatController.createConversation);
    this.router.post('/conversations/messages', chatController.sendMessage);
    this.router.put('/seed/:count', chatSeedController.createdSeeds);
    return this.router;
  }
}

export const chatRoutes = new ChatRoutes();
