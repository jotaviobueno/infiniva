import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartRepository } from 'src/repositories/abstracts/cart/cart.repository';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto';
import { DeleteResult, UpdateResult } from 'mongodb';
import { UpdateCartDto } from 'src/modules/cart/dto/update-cart.dto';

@Injectable()
export class MongodbCartRepository implements CartRepository {
  constructor(
    @InjectModel(Cart.name) private readonly model: Model<CartDocument>,
  ) {}

  async create(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    createCartDto: CreateCartDto,
  ) {
    const cart = new this.model({
      userId,
      productId,
      ...createCartDto,
    });

    return await cart.save();
  }

  async findByUserIdAndProductId(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<Cart> {
    return await this.model.findOne({ userId, productId });
  }

  async findByCartId(cart_id: string): Promise<Cart> {
    return await this.model.findOne({ cart_id });
  }

  async findCartByUserId(userId: Types.ObjectId): Promise<Cart[]> {
    const pipeline = [
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'stores',
                localField: 'storeId',
                foreignField: '_id',
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      userId: 0,
                      description: 0,
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
                _id: 0,
                storeId: 0,
                userId: 0,
                description: 0,
                categories: 0,
                information: {
                  _id: 0,
                },
                deletedAt: 0,
                rate: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $addFields: {
          total: {
            $let: {
              vars: {
                value: '$product.information.value',
              },
              in: {
                $multiply: ['$quantity', '$$value'],
              },
            },
          },
        },
      },
      {
        $project: { _id: 0, userId: 0, productId: 0, __v: 0 },
      },
    ];

    return await this.model.aggregate(pipeline);
  }

  async addMore(
    cartId: Types.ObjectId,
    createCartDto: CreateCartDto,
  ): Promise<UpdateResult> {
    return await this.model.updateOne(
      { _id: cartId },
      { $inc: { quantity: createCartDto.quantity } },
    );
  }

  async update(
    cartId: Types.ObjectId,
    updateCartDto: UpdateCartDto,
  ): Promise<UpdateResult> {
    return await this.model.updateOne(
      { _id: cartId },
      { $inc: { quantity: updateCartDto.quantity } },
    );
  }

  async remove(cartId: Types.ObjectId): Promise<DeleteResult> {
    return await this.model.deleteOne({ _id: cartId });
  }
}
