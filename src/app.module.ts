import { Module } from '@nestjs/common';
import { MongodbModule } from './repositories/implementations/mongodb/mongodb.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [MongodbModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
