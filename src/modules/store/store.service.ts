import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreRepository } from 'src/repositories/abstracts/store/store.repository';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';
import { toIStore } from 'src/common/mappers/store.mapper';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';
import { PaginationService } from '../pagination/pagination.service';
import * as bcrypt from 'bcrypt';
import { GetStoreOptions } from './interfaces/get-store-options';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly userRepository: UserRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(authAndUser: IAuthAndUser, createStoreDto: CreateStoreDto) {
    const nameAlreadyExist = await this.handleGetStore({
      name: createStoreDto.name,
    });

    if (nameAlreadyExist)
      throw new ConflictException('name informed already exist');

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
      await this.userRepository.includeTag(authAndUser.user._id, tag);

    return toIStore(store);
  }

  async findByStoreId(store_id: string) {
    if (!store_id) throw new BadRequestException('store_id is required');

    const store = await this.handleGetStore({ store_id });

    if (!store) throw new NotFoundException('store not found');

    return toIStore(store);
  }

  async findByName(name: string) {
    if (!name) throw new BadRequestException('name is required');

    const store = await this.handleGetStore({ name });

    if (!store) throw new NotFoundException('store not found');

    return toIStore(store);
  }

  async findAll(offsetAndLimit: IOffsetAndLimit) {
    const stores = await this.storeRepository.findAll(offsetAndLimit);

    const pagination = this.paginationService.handlePagination(
      stores,
      offsetAndLimit,
    );

    return { ...pagination };
  }

  async searchByName(name: string, offsetAndLimit: IOffsetAndLimit) {
    if (!name) throw new BadRequestException('name is required');

    const stores = await this.storeRepository.searchByName(
      name,
      offsetAndLimit,
    );

    const pagination = this.paginationService.handlePagination(
      stores,
      offsetAndLimit,
    );

    return { ...pagination };
  }

  async update(
    authAndUser: IAuthAndUser,
    store_id: string,
    updateStoreDto: UpdateStoreDto,
  ) {
    if (Object.keys(updateStoreDto).length === 1)
      throw new BadRequestException('fields to update not sent');

    const store = await this.handleGetStore({ store_id });

    if (!store) throw new NotFoundException('store not found');

    if (store.userId.toString() !== authAndUser.user._id.toString())
      throw new ForbiddenException('you no are owner this store');

    const passwordIsValid = await bcrypt.compare(
      updateStoreDto.password,
      authAndUser.user.password,
    );

    if (!passwordIsValid) throw new UnauthorizedException('password incorrect');

    if (updateStoreDto.name) {
      if (updateStoreDto.name === store.name)
        throw new ConflictException('this name is the same as your store');

      const nameAlreadyExist = await this.handleGetStore({
        name: updateStoreDto.name,
      });

      if (nameAlreadyExist) throw new ConflictException('name already exists');
    }

    await this.storeRepository.update(store._id, updateStoreDto);
  }

  async remove(authAndUser: IAuthAndUser, store_id: string, password: string) {
    if (!password) throw new BadRequestException('password is required');

    const store = await this.handleGetStore({ store_id });

    if (!store) throw new NotFoundException('store not found');

    if (store.userId.toString() !== authAndUser.user._id.toString())
      throw new ForbiddenException('you no are owner this store');

    const passwordIsValid = await bcrypt.compare(
      password,
      authAndUser.user.password,
    );

    if (!passwordIsValid) throw new UnauthorizedException('password incorrect');

    // Delete all products after
    await this.storeRepository.remove(store._id);
  }

  async handleGetStore({ name, storeId, store_id }: GetStoreOptions) {
    if (name) return await this.storeRepository.findByName(name);

    if (storeId) return await this.storeRepository.findById(storeId);

    if (store_id) return await this.storeRepository.findByStoreId(store_id);
  }
}
