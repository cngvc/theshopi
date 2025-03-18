import { IConversationDocument } from '@cngvc/shopi-types';
import { Model, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const conversationSchema: Schema = new Schema(
  {
    conversationPublicId: { type: String, unique: true, index: true, default: uuidv4 },
    participants: {
      type: [
        {
          authId: { type: String, required: true },
          username: { type: String, required: true }
        }
      ],
      required: true
    },
    lastMessage: {
      type: {
        messagePublicId: { type: String, default: null },
        senderAuthId: { type: String, default: null },
        body: { type: String, default: null },
        createdAt: { type: Date, default: Date.now }
      },
      default: null
    },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, rec) {
        delete rec._id;
        return rec;
      }
    }
  }
);

conversationSchema.pre('validate', async function (next) {
  if (!this.conversationPublicId) {
    this.conversationPublicId = uuidv4();
  }
  next();
});

const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>('Conversation', conversationSchema, 'Conversation');
export { ConversationModel };
