import { UpdateResult } from 'mongodb';
import { Types } from 'mongoose';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { IUsers } from 'src/modules/user/interfaces/iusers';
import { User } from 'src/repositories/implementations/mongodb/schemas/user.schema';

export abstract class UserRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;

  abstract findByUserId(userId: Types.ObjectId): Promise<User>;

  abstract forceFindByEmail(email: string): Promise<User>;

  abstract findByEmail(email: string): Promise<User>;

  abstract forceFindByUsername(username: string): Promise<User>;

  abstract findByUsername(username: string): Promise<User>;

  abstract findByAccountId(account_id: string): Promise<User>;

  abstract searchByName(
    name: string,
    offsetAndLimit: IOffsetAndLimit,
  ): Promise<IUsers[]>;

  abstract update(
    userId: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult>;

  abstract includeTag(
    userId: Types.ObjectId,
    tag: string,
  ): Promise<UpdateResult>;
}
