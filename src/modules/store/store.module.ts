import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [MongodbModule, PaginationModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
