import { grpcAuthClient } from '@chat/grpc/clients/auth-client.grpc';
import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/message.schema';
import { socketServer } from '@chat/server';
import { log } from '@chat/utils/logger.util';
import { BadRequestError } from '@cngvc/shopi-shared';
import { IBuyerDocument, IConversationDocument, IMessageDocument, IStoreDocument, SocketEvents } from '@cngvc/shopi-types';

class ChatService {
  createConversation = async (senderAuthId: string, receiverAuthId: string): Promise<IConversationDocument> => {
    const existingConversation = await this.findUserConversation(senderAuthId, receiverAuthId);
    if (existingConversation) {
      return existingConversation;
    }
    if (senderAuthId === receiverAuthId) {
    }
    const { participants } = await grpcAuthClient.getParticipantsByAuthIds([senderAuthId, receiverAuthId]);
    if (!participants.length) {
      throw new BadRequestError('Participants not found', 'createConversation');
    }
    const conversation = await ConversationModel.create({
      participants
    });
    const defaultMessage = await MessageModel.create({
      conversationPublicId: conversation.conversationPublicId,
      senderAuthId: receiverAuthId,
      receiverAuthId: senderAuthId,
      body: 'Hello! How can I help you?',
      isRead: false
    });
    conversation.lastMessage = {
      messagePublicId: `${defaultMessage.messagePublicId}`,
      senderAuthId: defaultMessage.senderAuthId,
      body: defaultMessage.body,
      createdAt: defaultMessage.createdAt
    };
    await conversation.save();
    return conversation;
  };

  createMessage = async (data: IMessageDocument) => {
    const message = (await MessageModel.create(data)).toJSON();
    socketServer.emit(SocketEvents.MESSAGE_RECEIVED, message);
    await ConversationModel.updateOne(
      { conversationPublicId: data.conversationPublicId },
      {
        $set: {
          lastMessage: {
            messagePublicId: message.messagePublicId,
            senderAuthId: message.senderAuthId,
            body: message.body
          }
        },
        $currentDate: { updatedAt: true }
      }
    );
  };

  findUserConversation = async (senderPublicId: string, receiverPublicId: string) => {
    const conversations = await ConversationModel.aggregate([
      {
        $match: {
          $and: [{ 'participants.authId': senderPublicId }, { 'participants.authId': receiverPublicId }]
        }
      },
      { $limit: 1 }
    ]);
    return conversations[0] || null;
  };

  findConversationByConversationPublicId = async (conversationPublicId: string) => {
    const conversation = await ConversationModel.findOne({ conversationPublicId: conversationPublicId }).lean();
    return conversation;
  };

  getConversationByConversationPublicId = async (conversationPublicId: string) => {
    const conversation = await this.findConversationByConversationPublicId(conversationPublicId);
    if (!conversation) return null;
    return conversation;
  };

  getConversationMessages = async (conversationPublicId: string): Promise<IMessageDocument[]> => {
    const messages: IMessageDocument[] = await MessageModel.aggregate([
      {
        $match: {
          conversationPublicId: conversationPublicId
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 20 }
    ]);
    if (messages.length) {
      return messages.reverse();
    }
    return [];
  };

  getCurrentUserConversations = async (authId: string): Promise<IConversationDocument[]> => {
    const conversations: IConversationDocument[] = await ConversationModel.aggregate([
      {
        $match: {
          participants: { $elemMatch: { authId } },
          lastMessage: { $ne: null }
        }
      },
      {
        $sort: {
          updatedAt: -1
        }
      }
    ]);
    return conversations;
  };

  getCurrentUserLastConversation = async (authId: string): Promise<IConversationDocument | null> => {
    const latestConversation: IConversationDocument[] = await ConversationModel.aggregate([
      {
        $match: {
          participants: { $elemMatch: { authId } },
          lastMessage: { $ne: null }
        }
      },
      {
        $sort: {
          updatedAt: -1
        }
      },
      {
        $limit: 1
      }
    ]);
    if (latestConversation.length) return latestConversation[0];
    return null;
  };

  createSeeds = async (stores: IStoreDocument[], buyers: IBuyerDocument[]): Promise<void> => {
    const count = Math.min(stores.length, buyers.length);
    for (let i = 0; i < count; i++) {
      const receiver = stores[i];
      const sender = buyers[i];
      for (let i = 0; i < count; i++) {
        if (sender.authId === receiver.ownerAuthId) {
          continue;
        }
        const savedConversation = await this.createConversation(`${sender.authId}`, `${receiver.ownerAuthId}`);
        const messages: IMessageDocument[] = [];
        await MessageModel.insertMany(messages);
        const lastMessage = messages.at(-1);
        if (lastMessage) {
          await ConversationModel.updateOne(
            { conversationPublicId: savedConversation.conversationPublicId },
            {
              $set: {
                lastMessage: {
                  messagePublicId: lastMessage.messagePublicId,
                  senderAuthId: lastMessage.senderAuthId,
                  body: lastMessage.body
                }
              },
              $currentDate: { updatedAt: true }
            }
          );
        }
      }
      log.info(`***Seeding chat:*** - ${i + 1} of ${count}`);
    }
  };
}

export const chatService = new ChatService();
