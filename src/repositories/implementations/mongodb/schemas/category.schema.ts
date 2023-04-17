import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    default: function () {
      return randomUUID();
    },
  })
  category_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  createdAt: Date;

  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
