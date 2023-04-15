import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Ip,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReqUser } from './decorators/req-user.decorator';
import { User } from 'src/repositories/implementations/mongodb/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  create(@ReqUser() user: User, @Ip() ip: string, @Req() req) {
    return this.authService.create(user, ip, req.headers['user-agent']);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
