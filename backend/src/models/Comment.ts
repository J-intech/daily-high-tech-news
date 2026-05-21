import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  newsId: mongoose.Types.ObjectId;
  username: string;
  email: string;
  content: string;
  likes: number;
  parentCommentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    newsId: {
      type: Schema.Types.ObjectId,
      ref: 'News',
      required: [true, 'Please provide a news ID']
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    likes: {
      type: Number,
      default: 0
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
commentSchema.index({ newsId: 1, createdAt: -1 });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
