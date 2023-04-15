import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReqOffsetAndLimit } from '../pagination/decorators/req-offset-and-limit';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  searchByName(
    @Query('name') name: string,
    @ReqOffsetAndLimit() offsetAndLimit: IOffsetAndLimit,
  ) {
    return this.userService.searchByName(name, offsetAndLimit);
  }

  @Get('/a/:account_id')
  @UseGuards(AuthGuard('jwt'))
  findByAccountId(@Param('account_id') account_id: string) {
    return this.userService.findByAccountId(account_id);
  }

  @Get(':username')
  @UseGuards(AuthGuard('jwt'))
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  update(
    @ReqUser() authAndUser: IAuthAndUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(authAndUser, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
