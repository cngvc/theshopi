import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/message.schema';
import { socketServer } from '@chat/server';
import { log } from '@chat/utils/logger.util';
import { IBuyerDocument, IConversationDocument, IMessageDocument, IStoreDocument, SocketEvents } from '@cngvc/shopi-shared-types';
import { faker } from '@faker-js/faker';

class ChatService {
  createConversation = async (sender: string, receiver: string): Promise<IConversationDocument> => {
    const existingConversation = await this.getConversationBySenderAndReceiver(sender, receiver);
    if (existingConversation) {
      return existingConversation;
    }
    return await ConversationModel.create({
      participants: [sender, receiver]
    });
  };

  createMessage = async (data: IMessageDocument) => {
    const message = await MessageModel.create(data);
    socketServer.emit(SocketEvents.MESSAGE_RECEIVED, message);
  };

  getConversationBySenderAndReceiver = async (sender: string, receiver: string) => {
    const conversations = await ConversationModel.aggregate([
      {
        $match: { participants: { $all: [sender, receiver] } }
      },
      {
        $limit: 1
      }
    ]).exec();
    return conversations[0];
  };

  getConversationByConversationId = async (conversationPublicId: string) => {
    const conversations = await ConversationModel.findOne({ conversationId: conversationPublicId });
    return conversations;
  };

  getConversationMessages = async (conversationPublicId: string): Promise<IMessageDocument[]> => {
    const messages: IMessageDocument[] = await MessageModel.aggregate([
      {
        $match: {
          conversationId: conversationPublicId
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 20 }
    ]);
    return messages.reverse();
  };

  getCurrentUserConversations = async (authId: string): Promise<IMessageDocument[]> => {
    const conversationLastMessages: IMessageDocument[] = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: authId }, { receiverId: authId }]
        }
      },
      {
        $group: {
          _id: '$conversationId',
          result: { $top: { output: '$$ROOT', sortBy: { createdAt: -1 } } }
        }
      },
      {
        $project: {
          _id: '$result._id',
          conversationId: '$result.conversationId',
          receiverId: '$result.receiverId',
          senderId: '$result.senderId',
          body: '$result.body',
          isRead: '$result.isRead',
          createdAt: '$result.createdAt'
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);
    return conversationLastMessages;
  };

  getCurrentUserLastConversation = async (authId: string): Promise<IMessageDocument> => {
    const conversationLastMessage: IMessageDocument[] = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: authId }, { receiverId: authId }]
        }
      },
      {
        $group: {
          _id: '$conversationId',
          result: { $top: { output: '$$ROOT', sortBy: { createdAt: -1 } } }
        }
      },
      {
        $project: {
          _id: '$result._id',
          conversationId: '$result.conversationId',
          receiverId: '$result.receiverId',
          senderId: '$result.senderId',
          body: '$result.body',
          isRead: '$result.isRead',
          createdAt: '$result.createdAt'
        }
      },
      {
        $limit: 1
      }
    ]).exec();
    if (conversationLastMessage.length) {
      return conversationLastMessage[0];
    }
    return {};
  };

  createSeeds = async (stores: IStoreDocument[], buyers: IBuyerDocument[]): Promise<void> => {
    const count = Math.min(stores.length, buyers.length);
    for (let i = 0; i < count; i++) {
      const receiver = stores[i];
      const sender = buyers[i];
      for (let i = 0; i < count; i++) {
        if (sender.authId === receiver.authOwnerId) {
          continue;
        }
        const savedConversation = await this.createConversation(`${sender.authId}`, `${receiver.authOwnerId}`);
        const messages: IMessageDocument[] = [];
        for (let i = 0; i < count * 5; i++) {
          messages.push({
            conversationId: savedConversation.conversationId,
            senderId: savedConversation.participants[0],
            receiverId: savedConversation.participants[1],
            body: faker.lorem.sentence()
          });
        }
        await MessageModel.insertMany(messages);
      }
      log.info(`***Seeding chat:*** - ${i + 1} of ${count}`);
    }
  };
}

export const chatService = new ChatService();
