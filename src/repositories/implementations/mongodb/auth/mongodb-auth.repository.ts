import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';
import { Auth, AuthDocument } from '../schemas/auth.schema';
import { Model, Types } from 'mongoose';
import { UpdateResult } from 'mongodb';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';

@Injectable()
export class MongodbAuthRepository implements AuthRepository {
  constructor(
    @InjectModel(Auth.name)
    private readonly model: Model<AuthDocument>,
  ) {}

  async create(
    access_id: string,
    userId: Types.ObjectId,
    address_ip: string,
    user_agent: string,
  ): Promise<Auth> {
    const auth = new this.model({ access_id, userId, address_ip, user_agent });

    return await auth.save();
  }

  async findByAccessId(access_id: string): Promise<Auth> {
    return await this.model.findOne({ access_id, disconnectedAt: null });
  }

  async findAll(
    userId: Types.ObjectId,
    { limit, offset }: IOffsetAndLimit,
  ): Promise<Auth[]> {
    const pagination = [{ $skip: offset }, { $limit: limit }];
    const pipeline = [
      {
        $match: {
          userId,
          disconenctAt: null,
        },
      },
      {
        $project: {
          _id: 0,
          userId: 0,
          __v: 0,
        },
      },
    ];

    return await this.model.aggregate([...pipeline, ...pagination]);
  }

  async disconnect(access_id: string): Promise<UpdateResult> {
    return await this.model.updateOne(
      { access_id },
      { disconnectedAt: new Date(), updatedAt: new Date() },
    );
  }

  async disconnectMany(userId: Types.ObjectId): Promise<UpdateResult> {
    return await this.model.updateMany(
      { userId, disconnectedAt: null },
      { disconnectedAt: new Date(), updatedAt: new Date() },
    );
  }
}
