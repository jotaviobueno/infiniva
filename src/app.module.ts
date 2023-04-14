import { Module } from '@nestjs/common';
import { MongodbModule } from './repositories/implementations/mongodb/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
