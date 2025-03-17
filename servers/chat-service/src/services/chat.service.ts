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
} from '@cngvc/shopi-types';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { faker } from '@faker-js/faker';

class ChatService {
  createConversation = async (senderAuthId: string, receiverAuthId: string): Promise<IConversationDocument> => {
    const existingConversation = await this.findUserConversation(senderAuthId, receiverAuthId);
    if (existingConversation) {
      return existingConversation;
    }
    if (senderAuthId === receiverAuthId) {
    }
    const conversation = await ConversationModel.create({
      participants: [senderAuthId, receiverAuthId]
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
    const message = await MessageModel.create(data);
    const _message = message.toJSON();
    const map = await this.findElasticsearchAuthByMessage(_message);
    _message['counterpartName'] = map.get(message.senderAuthId)?.username;
    _message['counterpartId'] = message.senderAuthId;
    socketServer.emit(SocketEvents.MESSAGE_RECEIVED, _message);
    await ConversationModel.updateOne(
      { conversationPublicId: data.conversationPublicId },
      {
        $set: {
          lastMessage: {
            messagePublicId: _message.messagePublicId,
            senderAuthId: _message.senderAuthId,
            body: _message.body
          }
        },
        $currentDate: { updatedAt: true }
      }
    );
  };

  findUserConversation = async (senderPublicId: string, receiverPublicId: string) => {
    const conversations = await ConversationModel.aggregate([
      {
        $match: { participants: { $all: [senderPublicId, receiverPublicId] } }
      },
      {
        $limit: 1
      }
    ]);
    return conversations[0];
  };

  findConversationByConversationPublicId = async (conversationPublicId: string) => {
    const conversation = await ConversationModel.findOne({ conversationPublicId: conversationPublicId }, { _id: 0 }).lean();
    return conversation;
  };

  getConversationByConversationPublicId = async (conversationPublicId: string, currentId: string) => {
    const conversation = await this.findConversationByConversationPublicId(conversationPublicId);
    if (!conversation) return null;
    const map = await this.findElasticsearchAuthByConversations(conversation);
    conversation.participants.forEach((participant) => {
      if (participant !== currentId) {
        conversation['counterpartName'] = map.get(participant)?.username;
        conversation['counterpartId'] = participant;
      }
    });
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
      try {
        const map = await this.findElasticsearchAuthByMessage(messages[0]);
        messages.forEach((message) => {
          message['counterpartName'] = map.get(message.senderAuthId)?.username;
          message['counterpartId'] = message.senderAuthId;
        });
      } catch (error) {}
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
    try {
      const map = await this.findElasticsearchAuthByConversations(conversations);
      conversations.forEach((conversation) => {
        conversation.participants.forEach((participant) => {
          if (participant !== authId) {
            conversation['counterpartName'] = map.get(participant)?.username;
            conversation['counterpartId'] = participant;
          }
        });
      });
    } catch (error) {}

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
        for (let i = 0; i < count * 5; i++) {
          messages.push({
            conversationPublicId: savedConversation.conversationPublicId!,
            senderAuthId: savedConversation.participants[0],
            receiverAuthId: savedConversation.participants[1],
            body: faker.lorem.sentence()
          });
        }
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

  private findElasticsearchAuthByConversations = async (conversations: IConversationDocument | IConversationDocument[]) => {
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
    let users: IBuyerDocument[] = [];
    const queryList = [{ terms: { 'authId.keyword': [...new Set(uniqueUserIds)] } }];
    const { hits }: SearchResponse = await elasticSearch.search(ElasticsearchIndexes.auth, queryList);
    for (const item of hits.hits) {
      users.push(item._source as IBuyerDocument);
    }
    const map = new Map(users.map((u) => [u.authId, u]));
    return map;
  };

  private findElasticsearchAuthByMessage = async (message: IMessageDocument) => {
    let users: IBuyerDocument[] = [];
    const queryList = [{ terms: { 'authId.keyword': [message.senderAuthId!, message.receiverAuthId!] } }];
    const { hits }: SearchResponse = await elasticSearch.search(ElasticsearchIndexes.auth, queryList);
    for (const item of hits.hits) {
      users.push(item._source as IBuyerDocument);
    }
    const map = new Map(users.map((u) => [u.authId, u]));
    return map;
  };
}

export const chatService = new ChatService();
