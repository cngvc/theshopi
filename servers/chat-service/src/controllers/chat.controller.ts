import { ConversationModel } from '@chat/models/conversation.schema';
import { createConversionSchema, sendMessageSchema } from '@chat/schemes/chat.scheme';
import { chatService } from '@chat/services/chat.service';
import { BadRequestError, CreatedRequestSuccess, IConversationDocument, IMessageDocument, OkRequestSuccess } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class ChatController {
  getUserConversations = async (req: Request, res: Response): Promise<void> => {
    const conversationLastMessages: IMessageDocument[] = await chatService.getUserConversations(req.currentUser!.username);
    new OkRequestSuccess('Conversation list', {
      conversations: conversationLastMessages
    });
  };

  getConversationByConversationPublicId = async (req: Request, res: Response): Promise<void> => {
    const { conversationId } = req.params;
    const conversation = await chatService.getConversationByConversationPublicId(conversationId);
    new OkRequestSuccess('Chat conversation.', {
      conversation
    }).send(res);
  };

  getConversationMessages = async (req: Request, res: Response): Promise<void> => {
    const { conversationId } = req.params;
    const messages: IMessageDocument[] = await chatService.getConversationMessages(conversationId);
    new OkRequestSuccess('Conversation messages.', {
      messages
    }).send(res);
  };

  createConversation = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(createConversionSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createConversation method error');
    }
    const conversation = await chatService.createConversation(req.body.senderUsername, req.body.receiverUsername);
    new CreatedRequestSuccess('Conversation has been created.', {
      conversation
    }).send(res);
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(sendMessageSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'sendMessage method error');
    }
    const { conversationId, senderUsername, receiverUsername, body } = req.body;
    let conversation: IConversationDocument | null = null;
    if (conversationId) {
      conversation = await chatService.getConversationByConversationPublicId(conversationId);
    } else {
      conversation = await chatService.getConversationBySenderAndReceiver(senderUsername, receiverUsername);
    }
    if (!conversation) {
      conversation = await ConversationModel.create({
        senderUsername,
        receiverUsername
      });
    }
    const message: IMessageDocument = {
      conversationId: conversation.conversationId,
      body: body,
      senderUsername: senderUsername,
      receiverUsername: receiverUsername
    };
    await chatService.createMessage(message);
    new OkRequestSuccess('Message has been sent.', {
      message
    }).send(res);
  };
}

export const chatController = new ChatController();
