import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
