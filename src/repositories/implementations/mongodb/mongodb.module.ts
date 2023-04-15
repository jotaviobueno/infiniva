import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from 'src/config/mongodb';

// Models / Schemas
import { User, UserSchema } from './schemas/user.schema';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { Store, StoreSchema } from './schemas/store.schema';

// Repositories
import { MongodbUserRepository } from './user/mongodb-user.repository';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';

import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';
import { MongodbAuthRepository } from './auth/mongodb-auth.repository';

import { StoreRepository } from 'src/repositories/abstracts/store/store.repository';
import { MongodbStoreRepository } from './store/mongodb-store.repository';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Store.name, schema: StoreSchema },
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
    {
      provide: StoreRepository,
      useClass: MongodbStoreRepository,
    },
  ],
  exports: [UserRepository, AuthRepository, StoreRepository],
})
export class MongodbModule {}
