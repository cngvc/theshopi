import { IMessageDocument, SocketEvents } from '@cngvc/shopi-shared';
import { ConversationModel } from '@orders/models/conversation.schema';
import { MessageModel } from '@orders/models/message.schema';
import { socketServer } from '@orders/server';

class ChatService {
  createConversation = async (conversationId: string, sender: string, receiver: string): Promise<void> => {
    await ConversationModel.create({
      conversationId,
      senderUsername: sender,
      receiverUsername: receiver
    });
  };

  createMessage = async (data: IMessageDocument) => {
    const message = await MessageModel.create(data);
    socketServer.emit(SocketEvents.MESSAGE_RECEIVED, message);
  };

  getConversation = async (sender: string, receiver: string) => {
    const conversations = await ConversationModel.aggregate([
      {
        $match: {
          $or: [
            { senderUsername: sender, receiverUsername: receiver },
            { senderUsername: receiver, receiverUsername: sender }
          ]
        }
      }
    ]);
    return conversations;
  };
}

export const chatService = new ChatService();
