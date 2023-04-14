import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';
import { toIUser } from 'src/common/mappers/user.mapper';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';
import { PaginationService } from '../pagination/pagination.service';

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
    const users = await this.userRepository.searchByName(name, offsetAndLimit);

    const pagination = this.paginationService.handlePagination(
      users,
      offsetAndLimit,
    );

    return {
      ...pagination,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
