import { DeleteResult, UpdateResult } from 'mongodb';
import { Types } from 'mongoose';
import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto';
import { UpdateCartDto } from 'src/modules/cart/dto/update-cart.dto';
import { Cart } from 'src/repositories/implementations/mongodb/schemas/cart.schema';

export abstract class CartRepository {
  abstract create(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    createCartDto: CreateCartDto,
  ): Promise<Cart>;

  abstract findByUserIdAndProductId(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
  ): Promise<Cart>;

  abstract findByCartId(cart_id: string): Promise<Cart>;

  abstract findCartByUserId(userId: Types.ObjectId): Promise<Cart[]>;

  abstract addMore(
    cartId: Types.ObjectId,
    createCartDto: CreateCartDto,
  ): Promise<UpdateResult>;

  abstract update(
    cartId: Types.ObjectId,
    updateCartDto: UpdateCartDto,
  ): Promise<UpdateResult>;

  abstract remove(cartId: Types.ObjectId): Promise<DeleteResult>;
}
