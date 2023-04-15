import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoreRepository } from 'src/repositories/abstracts/store/store.repository';
import { Store, StoreDocument } from '../schemas/store.schema';
import { Model, Types } from 'mongoose';
import { CreateStoreDto } from 'src/modules/store/dto/create-store.dto';

@Injectable()
export class MongodbStoreRepository implements StoreRepository {
  constructor(
    @InjectModel(Store.name) private readonly model: Model<StoreDocument>,
  ) {}

  async create(
    userId: Types.ObjectId,
    createStoreDto: CreateStoreDto,
  ): Promise<Store> {
    const store = new this.model({ userId, ...createStoreDto });

    return await store.save();
  }

  async countingAllStoresTheUser(userId: Types.ObjectId): Promise<number> {
    return await this.model.find({ userId, deletedAt: null }).countDocuments();
  }
}
