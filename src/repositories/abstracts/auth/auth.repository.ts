import { Types } from 'mongoose';
import { Auth } from 'src/repositories/implementations/mongodb/schemas/auth.schema';

export abstract class AuthRepository {
  abstract create(
    access_id: string,
    userId: Types.ObjectId,
    address_ip: string,
    user_agent: string,
  ): Promise<Auth>;

  abstract findByAccessId(access_id: string): Promise<Auth>;
}
