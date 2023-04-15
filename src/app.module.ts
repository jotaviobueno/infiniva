import { Module } from '@nestjs/common';
import { MongodbModule } from './repositories/implementations/mongodb/mongodb.module';
import { UserModule } from './modules/user/user.module';
import { PaginationModule } from './modules/pagination/pagination.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoreModule } from './modules/store/store.module';

@Module({
  imports: [
    MongodbModule,
    UserModule,
    PaginationModule,
    AuthModule,
    StoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
