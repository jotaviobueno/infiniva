import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';
import { Auth, AuthDocument } from '../schemas/auth.schema';
import { Model, Types } from 'mongoose';

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
}
