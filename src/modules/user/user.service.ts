import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';
import { toIUser } from 'src/common/mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

  findAll() {
    return `This action returns all user`;
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
