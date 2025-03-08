import { ConversationModel } from '@chat/models/conversation.schema';
import { chatService } from '@chat/services/chat.service';
import { BadRequestError, CreatedRequestSuccess, OkRequestSuccess } from '@cngvc/shopi-shared';
import { createConversionSchema, IConversationDocument, IMessageDocument, sendMessageSchema } from '@cngvc/shopi-shared-types';
import { Request, Response } from 'express';

class ChatController {
  getCurrentUserConversations = async (req: Request, res: Response): Promise<void> => {
    const conversations: IConversationDocument[] = await chatService.getCurrentUserConversations(req.currentUser!.id);
    new OkRequestSuccess('Conversation list', {
      conversations: conversations
    }).send(res);
  };

  getCurrentUserLastConversation = async (req: Request, res: Response): Promise<void> => {
    const conversationLastMessage: IMessageDocument = await chatService.getCurrentUserLastConversation(req.currentUser!.id);
    new OkRequestSuccess('Last conversation', {
      conversations: conversationLastMessage
    }).send(res);
  };

  getConversationByConversationId = async (req: Request, res: Response): Promise<void> => {
    const { conversationId } = req.params;
    const conversation = await chatService.getConversationByConversationId(conversationId);
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
    const senderId = req.currentUser!.id;
    const conversation = await chatService.createConversation(senderId, req.body.receiverId);
    new CreatedRequestSuccess('Conversation has been created.', {
      conversation
    }).send(res);
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(sendMessageSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'sendMessage method error');
    }
    const { conversationId, receiverId, body } = req.body;

    const senderId = req.currentUser!.id;
    let conversation: IConversationDocument | null = null;
    if (conversationId) {
      conversation = await chatService.getConversationByConversationId(conversationId);
    } else {
      conversation = await chatService.getConversationBySenderAndReceiver(senderId, receiverId);
    }
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [senderId, receiverId]
      });
    }
    const message: IMessageDocument = {
      conversationId: conversation!.conversationId,
      body: body,
      senderId: senderId,
      receiverId: receiverId
    };
    await chatService.createMessage(message);
    new OkRequestSuccess('Message has been sent.', {
      message
    }).send(res);
  };
}

export const chatController = new ChatController();
