import { elasticSearch } from '@chat/elasticsearch';
import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/message.schema';
import { socketServer } from '@chat/server';
import { log } from '@chat/utils/logger.util';
import {
  ElasticsearchIndexes,
  IBuyerDocument,
  IConversationDocument,
  IMessageDocument,
  IStoreDocument,
  SocketEvents
} from '@cngvc/shopi-shared-types';
import { faker } from '@faker-js/faker';
import { get } from 'lodash';

class ChatService {
  createConversation = async (sender: string, receiver: string): Promise<IConversationDocument> => {
    const existingConversation = await this.getUserConversation(sender, receiver);
    if (existingConversation) {
      return existingConversation;
    }
    const conversation = await ConversationModel.create({
      participants: [sender, receiver]
    });
    const defaultMessage = await MessageModel.create({
      conversationId: conversation._id,
      senderId: receiver,
      receiverId: sender,
      body: 'Hello! How can I help you?',
      isRead: false
    });
    conversation.lastMessage = {
      messageId: `${defaultMessage._id}`,
      senderId: defaultMessage.senderId,
      body: defaultMessage.body,
      createdAt: defaultMessage.createdAt
    };
    await conversation.save();
    return conversation;
  };

  createMessage = async (data: IMessageDocument) => {
    const message = await MessageModel.create(data);
    await ConversationModel.updateOne(
      { conversationId: data.conversationId },
      {
        $set: {
          lastMessage: {
            messageId: message.id,
            senderId: message.senderId,
            body: message.body
          }
        },
        $currentDate: { updatedAt: true }
      }
    );
    socketServer.emit(SocketEvents.MESSAGE_RECEIVED, message);
  };

  getUserConversation = async (sender: string, receiver: string) => {
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

  getConversationByConversationId = async (conversationPublicId: string, currentId: string) => {
    const conversation = await ConversationModel.findOne({ conversationId: conversationPublicId });
    if (!conversation) return null;
    const objUsers = await this.getElasticsearchAuthByConversations(conversation);
    conversation.participants.forEach((participant) => {
      if (participant !== currentId) {
        conversation['displayname'] = objUsers[participant]?.username || null;
      }
    });
    return conversation;
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
    if (messages.length) {
      const objUsers = await this.getElasticsearchAuthByMessage(messages[0]);
      messages.forEach((message) => {
        message['displayname'] = objUsers[message.senderId!]?.username || null;
      });
      return messages.reverse();
    }
    return [];
  };

  getCurrentUserConversations = async (authId: string): Promise<IConversationDocument[]> => {
    const conversations: IConversationDocument[] = await ConversationModel.aggregate([
      {
        $match: {
          participants: {
            $in: [authId]
          },
          lastMessage: { $ne: null }
        }
      },
      {
        $sort: {
          updatedAt: -1
        }
      }
    ]);
    const objUsers = await this.getElasticsearchAuthByConversations(conversations);
    conversations.forEach((conversation) => {
      conversation.participants.forEach((participant) => {
        if (participant !== authId) {
          conversation['displayname'] = objUsers[participant]?.username || null;
        }
      });
    });
    return conversations;
  };

  getCurrentUserLastConversation = async (authId: string): Promise<IConversationDocument | null> => {
    const latestConversation: IConversationDocument[] = await ConversationModel.aggregate([
      {
        $match: {
          participants: {
            $in: [authId]
          },
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
    ]).exec();
    if (latestConversation.length) return latestConversation[0];
    return null;
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
        const lastMessage = messages.at(-1);
        if (lastMessage) {
          await ConversationModel.updateOne(
            { conversationId: savedConversation.conversationId },
            {
              $set: {
                lastMessage: {
                  messageId: lastMessage._id,
                  senderId: lastMessage.senderId,
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

  private getElasticsearchAuthByConversations = async (conversations: IConversationDocument | IConversationDocument[]) => {
    const uniqueUserIds = new Set<string>();
    if (Array.isArray(conversations)) {
      conversations.forEach((conversation) => {
        conversation.participants.forEach((participant) => {
          uniqueUserIds.add(participant);
        });
      });
    } else {
      conversations.participants.forEach((participant) => {
        uniqueUserIds.add(participant);
      });
    }
    const { docs } = await elasticSearch.client.mget({
      index: ElasticsearchIndexes.auth,
      body: { ids: [...new Set(uniqueUserIds)] }
    });
    const objUsers = docs.reduce(
      (acc, doc) => {
        if (doc._id) acc[doc._id] = get(doc, ['_source']);
        return acc;
      },
      {} as Record<string, any>
    );
    return objUsers;
  };

  private getElasticsearchAuthByMessage = async (message: IMessageDocument) => {
    const { docs } = await elasticSearch.client.mget({
      index: ElasticsearchIndexes.auth,
      body: { ids: [message.senderId!, message.receiverId!] }
    });
    const objUsers = docs.reduce(
      (acc, doc) => {
        if (doc._id) acc[doc._id] = get(doc, ['_source']);
        return acc;
      },
      {} as Record<string, any>
    );
    return objUsers;
  };
}

export const chatService = new ChatService();
