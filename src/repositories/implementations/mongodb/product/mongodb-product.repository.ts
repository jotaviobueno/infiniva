import { Model, Types } from 'mongoose';
import { CreateProductDto } from 'src/modules/product/dto/create-product.dto';
import { ProductRepository } from 'src/repositories/abstracts/product/product.repository';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { IProducts } from 'src/modules/product/interfaces/iproducts';
import { UpdateResult } from 'mongodb';
import { UpdateProductDto } from 'src/modules/product/dto/update-product.dto';

@Injectable()
export class MongodbProductRepository implements ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly model: Model<ProductDocument>,
  ) {}

  async create(
    userId: Types.ObjectId,
    storeId: Types.ObjectId,
    categories: Types.ObjectId[],
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const data = {
      ...createProductDto,
      categories,
      storeId,
      userId,
      information: {
        ...createProductDto,
      },
    };

    const product = new this.model({ ...data });

    return await product.save();
  }

  async aggregateByProductId(product_id: string): Promise<Product> {
    // eslint-disable-next-line prefer-const
    let pipeline = this.defaultPipelineGetIProduct();

    pipeline[0]['$match']['product_id'] = product_id;

    const result = await this.model.aggregate(pipeline);

    return result[0];
  }

  async findAll({ offset, limit }: IOffsetAndLimit): Promise<IProducts[]> {
    const pagination = [
      { $skip: offset },
      { $limit: limit },
      { $sample: { size: limit } },
    ];
    const pipeline = this.defaultPipelineGetManyIProducts();

    return await this.model.aggregate([...pagination, ...pipeline]);
  }

  async findByProductId(product_id: string): Promise<Product> {
    return await this.model.findOne({ product_id, deletedAt: null });
  }

  async findById(productId: Types.ObjectId): Promise<Product> {
    return await this.model.findOne({ _id: productId, deletedAt: null });
  }

  async searchByName(
    name: string,
    { limit, offset }: IOffsetAndLimit,
  ): Promise<IProducts[]> {
    // eslint-disable-next-line prefer-const
    let pipeline = this.defaultPipelineGetManyIProducts();
    const pagination = [
      { $skip: offset },
      { $limit: limit },
      { $sample: { size: limit } },
    ];
    pipeline[0]['$match']['$or'] = [{ name: { $regex: name, $options: 'i' } }];

    return await this.model.aggregate([...pagination, ...pipeline]);
  }

  async update(
    productId: Types.ObjectId,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    const data = {
      ...updateProductDto,
      information: {
        ...updateProductDto,
      },
    };

    return await this.model.updateOne(
      { _id: productId, deletedAt: null },
      { ...data, updatedAt: new Date() },
    );
  }

  async addStock(
    productId: Types.ObjectId,
    stock: number,
  ): Promise<UpdateResult> {
    return await this.model.updateOne(
      { _id: productId },
      { $inc: { 'information.stock': stock } },
    );
  }

  async removeStock(
    productId: Types.ObjectId,
    stock: number,
  ): Promise<UpdateResult> {
    return await this.model.updateOne(
      { _id: productId },
      { $inc: { 'information.stock': -stock } },
    );
  }

  async remove(productId: Types.ObjectId): Promise<UpdateResult> {
    return await this.model.updateOne(
      { _id: productId, deletedAt: null },
      { deletedAt: new Date(), updatedAt: new Date() },
    );
  }

  async deleteAllProducts(storeId: Types.ObjectId): Promise<UpdateResult> {
    return await this.model.updateMany(
      { storeId, deletedAt: null },
      { deletedAt: new Date(), updatedAt: new Date() },
    );
  }

  private defaultPipelineGetIProduct() {
    const pipeline = [
      { $match: { deletedAt: null } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          pipeline: [
            {
              $addFields: {
                category_url: {
                  $concat: ['/category/', '$category_id'],
                },
              },
            },
            {
              $project: {
                _id: 0,
                userId: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: 'categories',
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'storeId',
          foreignField: '_id',
          pipeline: [
            { $match: { deletedAt: null } },
            {
              $project: {
                _id: 0,
                userId: 0,
                description: 0,
                total_sale: 0,
                deletedAt: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: 'store',
        },
      },
      { $unwind: '$store' },
      // {
      //   // $addFields: {
      //   //   average_rating:
      //   // },
      // },
      {
        $project: {
          storeId: 0,
          'information._id': 0,
          _id: 0,
          userId: 0,
          deletedAt: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ];

    return pipeline;
  }

  private defaultPipelineGetManyIProducts() {
    const pipeline = [
      { $match: { deletedAt: null } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          pipeline: [
            {
              $addFields: {
                category_url: {
                  $concat: ['/category/', '$category_id'],
                },
              },
            },
            {
              $project: {
                _id: 0,
                userId: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: 'categories',
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'storeId',
          foreignField: '_id',
          pipeline: [
            { $match: { deletedAt: null } },
            {
              $project: {
                _id: 0,
                userId: 0,
                description: 0,
                total_sale: 0,
                deletedAt: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: 'store',
        },
      },
      { $unwind: '$store' },
      {
        $project: {
          storeId: 0,
          rate: 0,
          'information._id': 0,
          _id: 0,
          userId: 0,
          description: 0,
          deletedAt: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ];

    return pipeline;
  }
}
