import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [MongodbModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
