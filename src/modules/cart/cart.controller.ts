import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/:product_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  create(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('product_id') product_id: string,
    @Body() createCartDto: CreateCartDto,
  ) {
    return this.cartService.create(authAndUser, product_id, createCartDto);
  }

  @Get()
  findAll(@ReqUser() authAndUser: IAuthAndUser) {
    return this.cartService.findAll(authAndUser);
  }

  @Patch(':cart_id')
  update(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('cart_id') cart_id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(authAndUser, cart_id, updateCartDto);
  }

  @Delete(':cart_id')
  remove(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('cart_id') cart_id: string,
  ) {
    return this.cartService.remove(authAndUser, cart_id);
  }
}
