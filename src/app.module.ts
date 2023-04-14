import { Module } from '@nestjs/common';
import { MongodbModule } from './repositories/implementations/mongodb/mongodb.module';
import { UserModule } from './modules/user/user.module';
import { PaginationModule } from './modules/pagination/pagination.module';

@Module({
  imports: [MongodbModule, UserModule, PaginationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
