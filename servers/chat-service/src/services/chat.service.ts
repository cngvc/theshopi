import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/message.schema';
import { socketServer } from '@chat/server';
import { IConversationDocument, IMessageDocument, SocketEvents } from '@cngvc/shopi-shared';

class ChatService {
  createConversation = async (sender: string, receiver: string): Promise<IConversationDocument> => {
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
    const conversations = await ConversationModel.findOne({
      $match: this.conversationQuery(sender, receiver)
    });
    return conversations;
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

  private conversationQuery(sender: string, receiver: string) {
    return {
      $or: [
        { senderUsername: sender, receiverUsername: receiver },
        { senderUsername: receiver, receiverUsername: sender }
      ]
    };
  }
}

export const chatService = new ChatService();
