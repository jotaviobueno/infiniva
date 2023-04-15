import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
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

AuthSchema.pre('updateOne', async function (next) {
  const update = this.getQuery();
  if (update && update.disconnectedAt) {
    await this.updateOne(
      {},
      {
        $set: {
          expirationDate: new Date(
            update.disconnectedAt.getTime() + 10 * 60 * 1000,
          ),
        },
      },
    );

    next();
  }
});
