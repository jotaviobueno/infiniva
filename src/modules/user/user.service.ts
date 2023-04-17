import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';
import { toIUser } from 'src/common/mappers/user.mapper';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';
import { PaginationService } from '../pagination/pagination.service';
import { GetUserOptions } from './interfaces/get-user-options';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,

    private readonly paginationService: PaginationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailAlreadyExist = await this.userRepository.forceFindByEmail(
      createUserDto.email,
    );

    if (emailAlreadyExist) throw new ConflictException('email already exist.');

    const usernameAlreadyExist = await this.userRepository.forceFindByUsername(
      createUserDto.username,
    );

    if (usernameAlreadyExist)
      throw new ConflictException('username already exist.');

    const user = await this.userRepository.create(createUserDto);

    return toIUser(user);
  }

  async searchByName(name: string, offsetAndLimit: IOffsetAndLimit) {
    if (!name) throw new BadRequestException('name not sent');

    const users = await this.userRepository.searchByName(name, offsetAndLimit);

    if (users.length === 0)
      throw new NotFoundException('no user with that name was found');

    const pagination = this.paginationService.handlePagination(
      users,
      offsetAndLimit,
    );

    return {
      ...pagination,
    };
  }

  async findByAccountId(account_id: string) {
    const userExist = await this.handleGetUser({ account_id });

    return toIUser(userExist);
  }

  async findByUsername(username: string) {
    const userExist = await this.handleGetUser({ username });

    return toIUser(userExist);
  }

  async update(authAndUser: IAuthAndUser, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      if (updateUserDto.username === authAndUser.user.username)
        throw new ConflictException('username is equal');

      await this.handleGetUser({
        username: updateUserDto.username,
      });
    }

    if (updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    const update = await this.userRepository.update(
      authAndUser.user._id,
      updateUserDto,
    );

    if (update.modifiedCount === 1 && updateUserDto.password)
      await this.authRepository.disconnectMany(authAndUser.user._id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // Arrumar
  async handleGetUser({ userId, account_id, username, email }: GetUserOptions) {
    if (userId) {
      const user = await this.userRepository.findByUserId(userId);

      if (!user) throw new NotFoundException('user not found');

      return user;
    }

    if (account_id) {
      const user = await this.userRepository.findByAccountId(account_id);

      if (!user) throw new NotFoundException('user not found');

      return user;
    }

    if (username) {
      const user = await this.userRepository.findByUsername(username);

      if (!user) throw new NotFoundException('user not found');

      return user;
    }

    if (email) {
      const user = await this.userRepository.findByEmail(email);

      if (!user) throw new NotFoundException('user not found');

      return user;
    }
  }
}
