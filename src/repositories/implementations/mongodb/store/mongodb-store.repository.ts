import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoreRepository } from 'src/repositories/abstracts/store/store.repository';
import { Store, StoreDocument } from '../schemas/store.schema';
import { Model, Types } from 'mongoose';
import { CreateStoreDto } from 'src/modules/store/dto/create-store.dto';
import { IStores } from 'src/modules/store/interfaces/istores';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { UpdateResult } from 'mongodb';
import { UpdateStoreDto } from 'src/modules/store/dto/update-store.dto';

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

  async findByStoreId(store_id: string): Promise<Store> {
    return await this.model.findOne({ store_id, deletedAt: null });
  }

  async findById(storeId: Types.ObjectId): Promise<Store> {
    return await this.model.findOne({ _id: storeId, deletedAt: null });
  }

  async findByName(name: string): Promise<Store> {
    return await this.model.findOne({ name, deletedAt: null });
  }

  async findAll({ offset, limit }: IOffsetAndLimit): Promise<IStores[]> {
    const pagination = [{ $skip: offset }, { $limit: limit }];
    const pipeline = [
      { $sample: { size: limit } },
      {
        $project: {
          _id: 0,
          userId: 0,
          description: 0,
          deletedAt: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ];

    return await this.model.aggregate([...pipeline, ...pagination]);
  }

  async findByUserId(userId: Types.ObjectId): Promise<Store[]> {
    return await this.model.find({ userId, deletedAt: null });
  }

  async searchByName(
    name: string,
    { offset, limit }: IOffsetAndLimit,
  ): Promise<IStores[]> {
    const pagination = [{ $skip: offset }, { $limit: limit }];
    const pipeline = [
      {
        $match: {
          deletedAt: null,
          $or: [{ name: { $regex: name, $options: 'i' } }],
        },
      },
      {
        $project: {
          _id: 0,
          userId: 0,
          description: 0,
          deletedAt: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ];

    return await this.model.aggregate([...pipeline, ...pagination]);
  }

  async update(
    storeId: Types.ObjectId,
    updateStoreDto: UpdateStoreDto,
  ): Promise<UpdateResult> {
    return await this.model.updateOne(
      { _id: storeId, deletedAt: null },
      {
        ...updateStoreDto,
        updatedAt: new Date(),
      },
    );
  }

  async remove(storeId: Types.ObjectId): Promise<UpdateResult> {
    return await this.model.updateOne(
      { _id: storeId, deletedAt: null },
      { deletedAt: new Date(), updatedAt: new Date() },
    );
  }

  async countingAllStoresTheUser(userId: Types.ObjectId): Promise<number> {
    return await this.model.find({ userId, deletedAt: null }).countDocuments();
  }
}
