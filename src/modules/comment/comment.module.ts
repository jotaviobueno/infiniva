import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';
import { PaginationModule } from '../pagination/pagination.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [MongodbModule, PaginationModule, ProductModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
