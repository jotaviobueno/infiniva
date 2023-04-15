import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreRepository } from 'src/repositories/abstracts/store/store.repository';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';
import { toIStore } from 'src/common/mappers/store.mapper';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(authAndUser: IAuthAndUser, createStoreDto: CreateStoreDto) {
    const userStores = await this.storeRepository.countingAllStoresTheUser(
      authAndUser.user._id,
    );

    if (userStores >= 2)
      throw new UnprocessableEntityException(
        'You have reached the maximum number of stores for a non-premium user. If you want to create more stores, please purchase premium.',
      );

    const store = await this.storeRepository.create(
      authAndUser.user._id,
      createStoreDto,
    );

    const tag = 'store_owner';

    if (!authAndUser.user.user_type.includes(tag))
      await this.userRepository.includeNewTag(authAndUser.user._id, tag);

    return toIStore(store);
  }

  findAll() {
    return `This action returns all store`;
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
