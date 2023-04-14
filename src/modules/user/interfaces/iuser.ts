import { Types } from 'mongoose';

export interface IUser {
  account_id: string;
  first_name: string;
  last_name: string;
  username: string;
  bio: string;
  user_type: string[];
  email: {
    address: string;
    verified_at: Date | null;
    _id: Types.ObjectId;
  };
  avatar_url: string;
  profile_url: string;
  createdAt: Date;
}
