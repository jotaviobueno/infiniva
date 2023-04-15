import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { AuthGuard } from '@nestjs/passport';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';
import { ReqOffsetAndLimit } from '../pagination/decorators/req-offset-and-limit';

@Controller('store')
@UseGuards(AuthGuard('jwt'))
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(
    @ReqUser() authAndUser: IAuthAndUser,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.create(authAndUser, createStoreDto);
  }

  @Get('/show/a/:store_id')
  findByStoreId(@Param('store_id') store_id: string) {
    return this.storeService.findByStoreId(store_id);
  }

  @Get('/show/:name')
  findByName(@Param('name') name: string) {
    return this.storeService.findByName(name);
  }

  @Get()
  findAll(@ReqOffsetAndLimit() offsetAndLimit: IOffsetAndLimit) {
    return this.storeService.findAll(offsetAndLimit);
  }

  @Get('/search')
  searchByName(
    @Query('name') name: string,
    @ReqOffsetAndLimit() offsetAndLimit: IOffsetAndLimit,
  ) {
    return this.storeService.searchByName(name, offsetAndLimit);
  }

  @Patch(':store_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('store_id') store_id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(authAndUser, store_id, updateStoreDto);
  }

  @Delete(':store_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('store_id') store_id: string,
    @Body('password') password: string,
  ) {
    return this.storeService.remove(authAndUser, store_id, password);
  }
}
