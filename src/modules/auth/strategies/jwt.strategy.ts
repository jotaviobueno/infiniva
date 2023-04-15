import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWT_SECRET } from 'src/config/jwt';
import { IPayload } from '../interfaces/ipayload';
import { IAuthAndUser } from '../interfaces/iauth-and-user';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';
import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: IPayload): Promise<IAuthAndUser> {
    const auth = await this.authRepository.findByAccessId(
      payload.sub.access_id,
    );

    if (!auth) throw new UnauthorizedException('session not found');

    const user = await this.userRepository.findByUserId(auth.userId);

    return {
      user,
      auth,
    } as IAuthAndUser;
  }
}
