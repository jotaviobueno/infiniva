import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { IUsers } from 'src/modules/user/interfaces/iusers';

@Injectable()
export class MongodbUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.model({
      ...createUserDto,
      email: { address: createUserDto.email },
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    return await user.save();
  }

  async findByUserId(userId: Types.ObjectId): Promise<User> {
    return await this.model.findOne({ _id: userId, deletedAt: null });
  }

  async forceFindByEmail(email: string): Promise<User> {
    return await this.model.findOne({ 'email.address': email });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.model.findOne({
      'email.address': email,
      deletedAt: null,
    });
  }

  async forceFindByUsername(username: string): Promise<User> {
    return await this.model.findOne({ username });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.model.findOne({ username, deletedAt: null });
  }

  async findByAccountId(account_id: string): Promise<User> {
    return await this.model.findOne({ account_id, deletedAt: null });
  }

  async searchByName(
    name: string,
    { offset, limit }: IOffsetAndLimit,
  ): Promise<IUsers[]> {
    const pagination = [{ $skip: offset }, { $limit: limit }];
    const pipeline = [
      {
        $match: {
          deletedAt: null,
          $or: [
            { username: { $regex: name, $options: 'i' } },
            { first_name: { $regex: name, $options: 'i' } },
            { last_name: { $regex: name, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          first_name: 0,
          last_name: 0,
          email: 0,
          user_type: 0,
          bio: 0,
          password: 0,
          deletedAt: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ];

    return await this.model.aggregate([...pipeline, ...pagination]);
  }
}
