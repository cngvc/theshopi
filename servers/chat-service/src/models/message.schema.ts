import { IMessageDocument } from '@cngvc/shopi-shared-types';
import { Model, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const messageSchema: Schema = new Schema(
  {
    messagePublicId: { type: String, unique: true, index: true, default: uuidv4 },
    conversationPublicId: { type: String, required: true, index: true },
    senderAuthId: { type: String, required: true, index: true },
    receiverAuthId: { type: String, required: true, index: true },
    body: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

messageSchema.pre('validate', async function (next) {
  if (!this.messagePublicId) {
    this.messagePublicId = uuidv4();
  }
  next();
});

const MessageModel: Model<IMessageDocument> = model<IMessageDocument>('Message', messageSchema, 'Message');
export { MessageModel };
