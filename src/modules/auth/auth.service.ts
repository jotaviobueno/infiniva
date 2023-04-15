import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/repositories/implementations/mongodb/schemas/user.schema';
import { randomUUID } from 'node:crypto';
import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { IAuthAndUser } from './interfaces/iauth-and-user';
import { PaginationService } from '../pagination/pagination.service';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authRepository: AuthRepository,

    private readonly jwtService: JwtService,
    private readonly paginationService: PaginationService,
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

  async findAll(authAndUser: IAuthAndUser, offsetAndLimit: IOffsetAndLimit) {
    const sessions = await this.authRepository.findAll(
      authAndUser.user._id,
      offsetAndLimit,
    );

    const pagination = this.paginationService.handlePagination(
      sessions,
      offsetAndLimit,
    );

    return {
      ...pagination,
    };
  }

  async disconnect(authAndUser: IAuthAndUser) {
    await this.authRepository.disconnect(authAndUser.auth.access_id);
  }

  async disconnectMany(authAndUser: IAuthAndUser, password: string) {
    if (!password) throw new BadRequestException('password is required');

    const passwordIsValid = await bcrypt.compare(
      password,
      authAndUser.user.password,
    );

    if (!passwordIsValid) throw new ForbiddenException('invalid password');

    await this.authRepository.disconnectMany(authAndUser.user._id);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.handleGetUser({ email });

    if (!user) return null;

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) return null;

    return user;
  }
}
