import { IConversationDocument } from '@cngvc/shopi-shared';
import { Model, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const conversationSchema: Schema = new Schema({
  conversationId: { type: String, unique: true, index: true },
  senderUsername: { type: String, required: true, index: true },
  receiverUsername: { type: String, required: true, index: true }
});

conversationSchema.pre('save', async function (next) {
  if (!this.conversationId) {
    this.conversationId = uuidv4();
  }
  next();
});

const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>('Conversation', conversationSchema, 'Conversation');
export { ConversationModel };
