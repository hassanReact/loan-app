import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

export const User = models.User || model('User', UserSchema);