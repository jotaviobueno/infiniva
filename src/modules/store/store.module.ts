import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
