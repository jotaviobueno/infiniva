import { Types } from 'mongoose';

export interface GetStoreOptions {
  storeId?: Types.ObjectId;
  name?: string;
  store_id?: string;
}
