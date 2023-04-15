import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { AuthGuard } from '@nestjs/passport';

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

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
