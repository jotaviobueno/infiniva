import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/repositories/implementations/mongodb/schemas/user.schema';
import { randomUUID } from 'node:crypto';
import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authRepository: AuthRepository,

    private readonly jwtService: JwtService,
  ) {}

  async create(user: User, address_ip: string, user_agent: string) {
    const access_id = randomUUID();

    await this.authRepository.create(
      access_id,
      user._id,
      address_ip,
      user_agent,
    );

    const payload = {
      sub: {
        id: user._id,
        access_id,
      },
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.handleGetUser({ email });

    if (!user) return null;

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) return null;

    return user;
  }
}
