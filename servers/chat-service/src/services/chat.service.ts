import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/message.schema';
import { socketServer } from '@chat/server';
import { log } from '@chat/utils/logger.util';
import { IBuyerDocument, IConversationDocument, IMessageDocument, IStoreDocument, SocketEvents } from '@cngvc/shopi-shared';
import { faker } from '@faker-js/faker';

class ChatService {
  createConversation = async (sender: string, receiver: string): Promise<IConversationDocument> => {
    const existingConversation = await this.getConversationBySenderAndReceiver(sender, receiver);
    if (existingConversation) {
      return existingConversation;
    }
    return await ConversationModel.create({
      senderUsername: sender,
      receiverUsername: receiver
    });
  };

  createMessage = async (data: IMessageDocument) => {
    const message = await MessageModel.create(data);
    socketServer.emit(SocketEvents.MESSAGE_RECEIVED, message);
  };

  getConversationBySenderAndReceiver = async (sender: string, receiver: string) => {
    const conversations = await ConversationModel.aggregate([
      {
        $match: {
          $or: [
            { senderUsername: sender, receiverUsername: receiver },
            { senderUsername: receiver, receiverUsername: sender }
          ]
        }
      },
      {
        $limit: 1
      }
    ]).exec();
    return conversations[0];
  };

  getConversationByConversationPublicId = async (conversationPublicId: string) => {
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
      { $sort: { createdAt: 1 } }
    ]);
    return messages;
  };

  marksMessagesAsRead = async (receiver: string, sender: string, messageId: string): Promise<IMessageDocument> => {
    await MessageModel.updateMany(
      { senderUsername: sender, receiverUsername: receiver, isRead: false },
      {
        $set: {
          isRead: true
        }
      }
    );
    const message = (await MessageModel.findOne({ _id: messageId }).exec()) as IMessageDocument;
    socketServer.emit(SocketEvents.MESSAGE_UPDATED, message);
    return message;
  };

  getCurrentUserConversations = async (username: string): Promise<IMessageDocument[]> => {
    const conversationLastMessages: IMessageDocument[] = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ senderUsername: username }, { receiverUsername: username }]
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
          receiverUsername: '$result.receiverUsername',
          senderUsername: '$result.senderUsername',
          body: '$result.body',
          isRead: '$result.isRead',
          createdAt: '$result.createdAt'
        }
      }
    ]);
    return conversationLastMessages;
  };

  createSeeds = async (stores: IStoreDocument[], buyers: IBuyerDocument[]): Promise<void> => {
    const count = Math.min(stores.length, buyers.length);
    for (let i = 0; i < count; i++) {
      const receiver = stores[i];
      const sender = buyers[i];
      for (let i = 0; i < count; i++) {
        const savedConversation = await this.createConversation(`${sender.username}`, `${receiver.username}`);
        const messages: IMessageDocument[] = [];
        for (let i = 0; i < count * 5; i++) {
          messages.push({
            conversationId: savedConversation.conversationId,
            senderUsername: savedConversation.senderUsername,
            receiverUsername: savedConversation.receiverUsername,
            buyerId: `${sender._id}`,
            storeId: `${receiver._id}`,
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
