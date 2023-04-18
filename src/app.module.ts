import { Module } from '@nestjs/common';
import { MongodbModule } from './repositories/implementations/mongodb/mongodb.module';
import { UserModule } from './modules/user/user.module';
import { PaginationModule } from './modules/pagination/pagination.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoreModule } from './modules/store/store.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { CommentModule } from './modules/comment/comment.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    MongodbModule,
    UserModule,
    PaginationModule,
    AuthModule,
    StoreModule,
    ProductModule,
    CategoryModule,
    CommentModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
