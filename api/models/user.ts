import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    formatted_phone: string;
    password: string
}

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    formatted_phone: {
      type: String,
    },
    password: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export const User = mongoose.model<IUser>('users', userSchema);