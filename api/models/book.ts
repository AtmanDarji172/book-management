import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
    name: string;
    author: string;
    description: string;
    price: number;
    formatted_price: string;
}

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    formatted_price: {
      type: String,
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export const Book = mongoose.model<IBook>('books', bookSchema);