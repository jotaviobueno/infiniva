import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    default: function () {
      return randomUUID();
    },
  })
  comment_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'products' })
  productId: Types.ObjectId;

  @Prop({ type: String, required: true })
  body: string;

  createdAt: Date;

  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
