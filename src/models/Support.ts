import { Schema, model, models } from 'mongoose';

const replySchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const supportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: String,
    message: String,
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    replies: [replySchema], // ✅ Replies embedded
  },
  { timestamps: true }
);

export const Support = models.Support || model('Support', supportSchema);
