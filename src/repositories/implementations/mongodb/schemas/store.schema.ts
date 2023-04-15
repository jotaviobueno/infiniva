import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument, Types } from 'mongoose';

export type StoreDocument = HydratedDocument<Store>;

@Schema({ timestamps: true })
export class Store {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    default: function () {
      return randomUUID();
    },
  })
  store_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 100,
  })
  name: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 2000 })
  description: string;

  // @Prop({ type: String, default: 0 })
  // total_sale: number;

  @Prop({
    type: String,
    default: 'https://i.stack.imgur.com/34AD2.jpg',
  })
  image_url: string;

  @Prop({
    type: String,
    default: function () {
      return `/store/${this.name}`;
    },
  })
  store_url: string;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
