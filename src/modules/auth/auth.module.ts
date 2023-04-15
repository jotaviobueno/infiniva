import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.stategy';

@Module({
  imports: [
    UserModule,
    MongodbModule,
    JwtModule.register({
      privateKey: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}