import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
class Rate {
  _id: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  five: number;

  @Prop({ type: Number, default: 0 })
  four: number;

  @Prop({ type: Number, default: 0 })
  three: number;

  @Prop({ type: Number, default: 0 })
  two: number;

  @Prop({ type: Number, default: 0 })
  one: number;
}

@Schema()
class ProductInformations {
  _id: Types.ObjectId;

  @Prop({ type: Number, require: true })
  weight: number;

  @Prop({ type: Number, require: true })
  stock: number;

  @Prop({ type: Number, require: true })
  value: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, default: 0 })
  sold_count: number;
}

@Schema({ timestamps: true })
export class Product {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    default: function () {
      return randomUUID();
    },
  })
  product_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'stores' })
  storeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  })
  name: string;

  @Prop({ type: String, required: true, minlength: 3, maxlength: 2000 })
  description: string;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  @Prop({ type: [Types.ObjectId], required: true, minlength: 1, maxlength: 5 })
  categories: Types.ObjectId[];

  @Prop({
    type: [String],
    default: [
      'https://cdn.discordapp.com/attachments/892911472458485760/1095877685567303720/33de990f-a614-4fca-a1e2-8a8753f2a559_sem_foto.jpg',
    ],
    maxlength: 7,
  })
  images_url: string[];

  @Prop({
    type: String,
    default: function () {
      return `/product/show/${this.product_id}`;
    },
  })
  product_url: string;

  @Prop({
    type: Rate,
    default: function () {
      return {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      };
    },
  })
  rate: Rate;

  @Prop({
    type: ProductInformations,
  })
  information: ProductInformations;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
