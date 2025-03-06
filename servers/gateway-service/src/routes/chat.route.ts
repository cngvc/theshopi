import { AuthMiddleware } from '@cngvc/shopi-shared';
import { chatSeedController } from '@gateway/controllers/chat/chat-seed.controller';
import { chatController } from '@gateway/controllers/chat/chat.controller';
import express, { Router } from 'express';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.use(AuthMiddleware.checkAuthentication);

    this.router.get('/chat/conversations/', chatController.getCurrentUserConversations);
    this.router.get('/chat/conversations/latest', chatController.getCurrentUserLastConversation);
    this.router.get('/chat/conversations/:conversationId', chatController.getConversationByConversationId);
    this.router.get('/chat/conversations/:conversationId/messages', chatController.getConversationMessages);
    this.router.post('/conversations', chatController.createConversation);
    this.router.post('/chat/conversations/messages', chatController.sendMessage);

    this.router.put('/seed/:count', chatSeedController.createSeeds);
    return this.router;
  }
}

export const chatRoutes = new ChatRoutes();
