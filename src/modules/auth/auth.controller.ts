import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Ip,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReqUser } from './decorators/req-user.decorator';
import { User } from 'src/repositories/implementations/mongodb/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { IAuthAndUser } from './interfaces/iauth-and-user';
import { ReqOffsetAndLimit } from '../pagination/decorators/req-offset-and-limit';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  create(@ReqUser() user: User, @Ip() ip: string, @Req() req) {
    return this.authService.create(user, ip, req.headers['user-agent']);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @ReqUser() authAndUser: IAuthAndUser,
    @ReqOffsetAndLimit() offsetAndLimit: IOffsetAndLimit,
  ) {
    return this.authService.findAll(authAndUser, offsetAndLimit);
  }

  @Delete('/disconnect')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  disconnect(@ReqUser() authAndUser: IAuthAndUser) {
    return this.authService.disconnect(authAndUser);
  }

  @Delete('/disconnect/many')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  disconnectMany(
    @ReqUser() authAndUser: IAuthAndUser,
    @Body('password') password: string,
  ) {
    return this.authService.disconnectMany(authAndUser, password);
  }
}
