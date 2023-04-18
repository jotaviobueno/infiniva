import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    default: function () {
      return randomUUID();
    },
  })
  cart_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'products' })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  createdAt: Date;

  updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
