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

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
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

    if (!userExist) throw new NotFoundException('user not found');

    return toIUser(userExist);
  }

  async findByUsername(username: string) {
    const userExist = await this.handleGetUser({ username });

    if (!userExist) throw new NotFoundException('username not found');

    return toIUser(userExist);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async handleGetUser({ userId, account_id, username, email }: GetUserOptions) {
    if (userId) return await this.userRepository.findByUserId(userId);

    if (account_id)
      return await this.userRepository.findByAccountId(account_id);

    if (username) return await this.userRepository.findByUsername(username);

    if (email) return await this.userRepository.findByEmail(email);
  }
}
