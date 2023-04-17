import { UpdateResult } from 'mongodb';
import { Types } from 'mongoose';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { CreateProductDto } from 'src/modules/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/modules/product/dto/update-product.dto';
import { IProducts } from 'src/modules/product/interfaces/iproducts';
import { Product } from 'src/repositories/implementations/mongodb/schemas/product.schema';

export abstract class ProductRepository {
  abstract create(
    userId: Types.ObjectId,
    storeId: Types.ObjectId,
    categories: Types.ObjectId[],
    createProductDto: CreateProductDto,
  ): Promise<Product>;

  abstract aggregateByProductId(product_id: string): Promise<Product>;

  abstract findAll(offsetAndLimit: IOffsetAndLimit): Promise<IProducts[]>;

  abstract findByProductId(product_id: string): Promise<Product>;

  abstract searchByName(
    name: string,
    offsetAndLimit: IOffsetAndLimit,
  ): Promise<IProducts[]>;

  abstract update(
    productId: Types.ObjectId,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult>;

  abstract remove(productId: Types.ObjectId): Promise<UpdateResult>;
}
