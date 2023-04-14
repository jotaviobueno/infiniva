import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/repositories/implementations/mongodb/schemas/user';

export abstract class UserRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;

  abstract forceFindByEmail(email: string): Promise<User>;

  abstract forceFindByUsername(username: string): Promise<User>;
}
