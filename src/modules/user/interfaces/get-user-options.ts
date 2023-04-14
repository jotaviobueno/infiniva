import { Types } from 'mongoose';

export interface GetUserOptions {
  userId?: Types.ObjectId;
  username?: string;
  email?: string;
  account_id?: string;
}
