import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from 'src/config/mongodb';

import { User, UserSchema } from './schemas/user.schema';
import { Auth, AuthSchema } from './schemas/auth.schema';

import { MongodbUserRepository } from './user/mongodb-user.repository';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';

import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';
import { MongodbAuthRepository } from './auth/mongodb-auth.repository';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: MongodbUserRepository,
    },
    {
      provide: AuthRepository,
      useClass: MongodbAuthRepository,
    },
  ],
  exports: [UserRepository, AuthRepository],
})
export class MongodbModule {}
