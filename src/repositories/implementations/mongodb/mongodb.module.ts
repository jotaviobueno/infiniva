import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from 'src/config/mongodb';

@Module({
  imports: [MongooseModule.forRoot(MONGO_URI)],
  providers: [],
  exports: [],
})
export class MongodbModule {}
