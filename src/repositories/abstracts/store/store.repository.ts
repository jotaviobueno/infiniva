import { Types } from 'mongoose';
import { CreateStoreDto } from 'src/modules/store/dto/create-store.dto';
import { Store } from 'src/repositories/implementations/mongodb/schemas/store.schema';

export abstract class StoreRepository {
  abstract create(
    userId: Types.ObjectId,
    createStoreDto: CreateStoreDto,
  ): Promise<Store>;

  abstract countingAllStoresTheUser(userId: Types.ObjectId): Promise<number>;
}
