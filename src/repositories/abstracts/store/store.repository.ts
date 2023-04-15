import { UpdateResult } from 'mongodb';
import { Types } from 'mongoose';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { CreateStoreDto } from 'src/modules/store/dto/create-store.dto';
import { UpdateStoreDto } from 'src/modules/store/dto/update-store.dto';
import { IStores } from 'src/modules/store/interfaces/istores';
import { Store } from 'src/repositories/implementations/mongodb/schemas/store.schema';

export abstract class StoreRepository {
  abstract create(
    userId: Types.ObjectId,
    createStoreDto: CreateStoreDto,
  ): Promise<Store>;

  abstract findByStoreId(store_id: string): Promise<Store>;

  abstract findById(storeId: Types.ObjectId): Promise<Store>;

  abstract findByName(name: string): Promise<Store>;

  abstract findAll(offsetAndLimit: IOffsetAndLimit): Promise<IStores[]>;

  abstract findByUserId(userId: Types.ObjectId): Promise<Store[]>;

  abstract searchByName(
    name: string,
    offsetAndLimit: IOffsetAndLimit,
  ): Promise<IStores[]>;

  abstract update(
    storeId: Types.ObjectId,
    updateStoreDto: UpdateStoreDto,
  ): Promise<UpdateResult>;

  abstract remove(storeId: Types.ObjectId): Promise<UpdateResult>;

  abstract countingAllStoresTheUser(userId: Types.ObjectId): Promise<number>;
}
