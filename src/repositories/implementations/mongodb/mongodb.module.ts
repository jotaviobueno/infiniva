import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from 'src/config/mongodb';

import { User, UserSchema } from './schemas/user';

import { MongodbUserRepository } from './user/mongodb-user.repository';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: MongodbUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class MongodbModule {}
