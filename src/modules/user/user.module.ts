import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [MongodbModule, PaginationModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
