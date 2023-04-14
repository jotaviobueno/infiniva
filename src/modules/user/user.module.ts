import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongodbModule } from 'src/repositories/implementations/mongodb/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
