import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user';

@Injectable()
export class MongodbUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.model({
      ...createUserDto,
      email: { address: createUserDto.email },
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    return await user.save();
  }
}
