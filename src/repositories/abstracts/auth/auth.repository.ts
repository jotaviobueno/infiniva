import { UpdateResult } from 'mongodb';
import { Types } from 'mongoose';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { Auth } from 'src/repositories/implementations/mongodb/schemas/auth.schema';

export abstract class AuthRepository {
  abstract create(
    access_id: string,
    userId: Types.ObjectId,
    address_ip: string,
    user_agent: string,
  ): Promise<Auth>;

  abstract findByAccessId(access_id: string): Promise<Auth>;

  abstract findAll(
    userId: Types.ObjectId,
    offsetAndLimit: IOffsetAndLimit,
  ): Promise<Auth[]>;

  abstract disconnect(access_id: string): Promise<UpdateResult>;

  abstract disconnectMany(userId: Types.ObjectId): Promise<UpdateResult>;
}
