import { AuthMiddleware } from '@cngvc/shopi-shared';
import { chatController } from '@gateway/controllers/chat/chat.controller';
import express, { Router } from 'express';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/chat/conversations/', AuthMiddleware.checkAuthentication, chatController.getCurrentUserConversations);
    this.router.get(
      '/chat/conversations/:conversationId',
      AuthMiddleware.checkAuthentication,
      chatController.getConversationByConversationPublicId
    );
    this.router.get(
      '/chat/conversations/:conversationId/messages',
      AuthMiddleware.checkAuthentication,
      chatController.getConversationMessages
    );
    this.router.post('/conversations', AuthMiddleware.checkAuthentication, chatController.createConversation);
    this.router.post('/conversations/messages', AuthMiddleware.checkAuthentication, chatController.sendMessage);
    return this.router;
  }
}

export const chatRoutes = new ChatRoutes();
