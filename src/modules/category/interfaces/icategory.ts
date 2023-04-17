import { Types } from 'mongoose';

export interface ICategory {
  _id?: Types.ObjectId;
  category_url?: string;
  category_id: string;
  name: string;
}
