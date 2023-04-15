import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ timestamps: true })
export class Auth {
  _id: Types.ObjectId;

  @Prop({
    type: String,
  })
  access_id: string;

  @Prop({ type: String, required: true })
  address_ip: string;

  @Prop({ type: String, required: true })
  user_agent: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  userId: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ type: Date, default: null })
  disconnectedAt: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
