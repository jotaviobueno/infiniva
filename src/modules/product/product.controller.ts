import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { ReqOffsetAndLimit } from '../pagination/decorators/req-offset-and-limit';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';

@Controller('product')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Headers('store_id') store_id: string,
    @Body() createProductDto: CreateProductDto,
    @ReqUser() authAndUser: IAuthAndUser,
  ) {
    return this.productService.create(authAndUser, store_id, createProductDto);
  }

  @Get()
  findAll(@ReqOffsetAndLimit() offsetAndLimit: IOffsetAndLimit) {
    return this.productService.findAll(offsetAndLimit);
  }

  @Get('/show/a/:product_id')
  findByProductId(@Param('product_id') product_id: string) {
    return this.productService.findByProductId(product_id);
  }

  @Get('/search')
  searchByName(
    @Query('name') name: string,
    @ReqOffsetAndLimit() offsetAndLimit: IOffsetAndLimit,
  ) {
    return this.productService.searchByName(name, offsetAndLimit);
  }

  @Patch(':product_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('product_id') product_id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(
      authAndUser,
      product_id,
      updateProductDto,
    );
  }

  @Delete(':product_id')
  remove(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('product_id') product_id: string,
  ) {
    return this.productService.remove(authAndUser, product_id);
  }
}
