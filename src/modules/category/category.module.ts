import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';

@Module({
  imports: [MongodbModule],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
