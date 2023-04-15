import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
class Email {
  _id: Types.ObjectId;

  @Prop({ type: String, unique: true, required: true })
  address: string;

  @Prop({
    type: String,
    default: function () {
      const provider = this.address.split('@')[1];

      return provider;
    },
  })
  provider: string;

  @Prop({ type: Date, default: null })
  verified_at: Date | null;
}

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    default: function () {
      return randomUUID();
    },
  })
  account_id: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
  first_name: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
  last_name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 20,
  })
  username: string;

  @Prop({ type: Email })
  email: Email;

  @Prop({
    type: String,
    default: function () {
      return `/user/${this.username}`;
    },
  })
  profile_url: string;

  @Prop({ type: String, default: 'https://i.stack.imgur.com/34AD2.jpg' })
  avatar_url: string;

  @Prop({
    type: [String],
    enum: ['user', 'store_owner', 'admin'],
    default: ['user'],
  })
  user_type: string[];

  @Prop({ type: String, default: 'no bio', minlength: 5, maxlength: 500 })
  bio: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
