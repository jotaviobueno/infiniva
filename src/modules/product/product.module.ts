import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';
import { StoreModule } from '../store/store.module';
import { CategoryModule } from '../category/category.module';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [MongodbModule, StoreModule, CategoryModule, PaginationModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
