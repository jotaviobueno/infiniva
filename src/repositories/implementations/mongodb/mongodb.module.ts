import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from 'src/config/mongodb';

// Models / Schemas
import { User, UserSchema } from './schemas/user.schema';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { Store, StoreSchema } from './schemas/store.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { Category, CategorySchema } from './schemas/category.schema';

// Repositories
import { MongodbUserRepository } from './user/mongodb-user.repository';
import { UserRepository } from 'src/repositories/abstracts/user/user.repository';

import { AuthRepository } from 'src/repositories/abstracts/auth/auth.repository';
import { MongodbAuthRepository } from './auth/mongodb-auth.repository';

import { StoreRepository } from 'src/repositories/abstracts/store/store.repository';
import { MongodbStoreRepository } from './store/mongodb-store.repository';

import { ProductRepository } from 'src/repositories/abstracts/product/product.repository';
import { MongodbProductRepository } from './product/mongodb-product.repository';

import { CategoryRepository } from 'src/repositories/abstracts/category/category.repository';
import { MongodbCategoryRepository } from './category/mongodb-category.repository';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Store.name, schema: StoreSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
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
    {
      provide: ProductRepository,
      useClass: MongodbProductRepository,
    },
    {
      provide: ProductRepository,
      useClass: MongodbProductRepository,
    },
    {
      provide: CategoryRepository,
      useClass: MongodbCategoryRepository,
    },
  ],
  exports: [
    UserRepository,
    AuthRepository,
    StoreRepository,
    ProductRepository,
    CategoryRepository,
  ],
})
export class MongodbModule {}
