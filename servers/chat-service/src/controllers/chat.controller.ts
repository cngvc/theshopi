import { ConversationModel } from '@chat/models/conversation.schema';
import { chatService } from '@chat/services/chat.service';
import { BadRequestError, CreatedRequestSuccess, getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { createConversionSchema, IConversationDocument, IMessageDocument, sendMessageSchema } from '@cngvc/shopi-types';
import { Request, Response } from 'express';

class ChatController {
  getCurrentUserConversations = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const conversations: IConversationDocument[] = await chatService.getCurrentUserConversations(currentUser.id);
    new OkRequestSuccess('Conversation list', {
      conversations: conversations
    }).send(res);
  };

  getCurrentUserLastConversation = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const conversation: IConversationDocument | null = await chatService.getCurrentUserLastConversation(currentUser.id);
    new OkRequestSuccess('Last conversation', {
      conversation: conversation
    }).send(res);
  };

  getConversationByConversationPublicId = async (req: Request, res: Response): Promise<void> => {
    const { conversationPublicId } = req.params;
    const conversation = await chatService.getConversationByConversationPublicId(conversationPublicId);
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
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const senderAuthId = currentUser.id;
    const receiverAuthId = req.body.receiverAuthId;
    if (receiverAuthId === senderAuthId) {
      throw new BadRequestError("Can't create conversation to yourself", 'createConversation method error');
    }
    const conversation = await chatService.createConversation(senderAuthId, receiverAuthId);
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
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const senderAuthId = currentUser.id;
    if (receiverAuthId === senderAuthId) {
      throw new BadRequestError("Can't create conversation to yourself", 'createConversation method error');
    }
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
