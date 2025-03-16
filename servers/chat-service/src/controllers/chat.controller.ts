import { ConversationModel } from '@chat/models/conversation.schema';
import { chatService } from '@chat/services/chat.service';
import { BadRequestError, CreatedRequestSuccess, OkRequestSuccess } from '@cngvc/shopi-shared';
import { createConversionSchema, IConversationDocument, IMessageDocument, sendMessageSchema } from '@cngvc/shopi-types';
import { Request, Response } from 'express';

class ChatController {
  getCurrentUserConversations = async (req: Request, res: Response): Promise<void> => {
    const conversations: IConversationDocument[] = await chatService.getCurrentUserConversations(req.currentUser!.id);
    new OkRequestSuccess('Conversation list', {
      conversations: conversations
    }).send(res);
  };

  getCurrentUserLastConversation = async (req: Request, res: Response): Promise<void> => {
    const conversation: IConversationDocument | null = await chatService.getCurrentUserLastConversation(req.currentUser!.id);
    new OkRequestSuccess('Last conversation', {
      conversation: conversation
    }).send(res);
  };

  getConversationByConversationPublicId = async (req: Request, res: Response): Promise<void> => {
    const { conversationPublicId } = req.params;
    const conversation = await chatService.getConversationByConversationPublicId(conversationPublicId, req.currentUser!.id);
    new OkRequestSuccess('Chat conversation.', {
      conversation
    }).send(res);
  };

  getConversationMessages = async (req: Request, res: Response): Promise<void> => {
    const { conversationPublicId } = req.params;
    const messages: IMessageDocument[] = await chatService.getConversationMessages(conversationPublicId);
    new OkRequestSuccess('Conversation messages.', {
      messages
    }).send(res);
  };

  createConversation = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(createConversionSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createConversation method error');
    }
    const senderAuthId = req.currentUser!.id;
    const conversation = await chatService.createConversation(senderAuthId, req.body.receiverAuthId);
    new CreatedRequestSuccess('Conversation has been created.', {
      conversation
    }).send(res);
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(sendMessageSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'sendMessage method error');
    }
    const { conversationPublicId, receiverAuthId, body } = req.body;
    const senderAuthId = req.currentUser!.id;
    let conversation: IConversationDocument | null = null;
    if (conversationPublicId) {
      conversation = await chatService.findConversationByConversationPublicId(conversationPublicId);
    } else {
      conversation = await chatService.findUserConversation(senderAuthId, receiverAuthId);
    }
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [senderAuthId, receiverAuthId]
      });
    }
    const message: IMessageDocument = {
      conversationPublicId: conversation.conversationPublicId!,
      body: body,
      senderAuthId: senderAuthId,
      receiverAuthId: receiverAuthId
    };
    await chatService.createMessage(message);
    new OkRequestSuccess('Message has been sent.', {
      message
    }).send(res);
  };
}

export const chatController = new ChatController();
