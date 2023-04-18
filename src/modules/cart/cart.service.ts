import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartRepository } from 'src/repositories/abstracts/cart/cart.repository';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { ProductService } from '../product/product.service';
import { ProductRepository } from 'src/repositories/abstracts/product/product.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly productService: ProductService,
  ) {}

  async create(
    authAndUser: IAuthAndUser,
    product_id: string,
    createCartDto: CreateCartDto,
  ) {
    const product = await this.productService.getProduct(product_id);

    if (authAndUser.user._id.toString() === product.userId.toString())
      throw new ForbiddenException('you cannot buy a product that you own');

    if (product.information.stock - createCartDto.quantity < 0)
      throw new UnprocessableEntityException(
        'the quantity of products informed is greater than the stock of the product',
      );

    const productAlradyInCart =
      await this.cartRepository.findByUserIdAndProductId(
        authAndUser.user._id,
        product._id,
      );

    if (productAlradyInCart) {
      if (
        productAlradyInCart.quantity + createCartDto.quantity >
        product.information.stock
      )
        throw new UnprocessableEntityException(
          'the quantity of products informed is greater than the stock of the product',
        );

      await this.cartRepository.addMore(productAlradyInCart._id, createCartDto);
      await this.productRepository.removeStock(
        product._id,
        createCartDto.quantity,
      );
    } else {
      await this.cartRepository.create(
        authAndUser.user._id,
        product._id,
        createCartDto,
      );
      await this.productRepository.removeStock(
        product._id,
        createCartDto.quantity,
      );
    }
  }

  async findAll(authAndUser: IAuthAndUser) {
    const cart = await this.cartRepository.findCartByUserId(
      authAndUser.user._id,
    );

    return cart;
  }

  async update(
    authAndUser: IAuthAndUser,
    cart_id: string,
    updateCartDto: UpdateCartDto,
  ) {
    const cartExist = await this.cartRepository.findByCartId(cart_id);

    if (!cartExist) throw new NotFoundException('cart not found');

    const product = await this.productRepository.findById(cartExist.productId);

    if (cartExist.userId.toString() != authAndUser.user._id.toString())
      throw new ForbiddenException('You are not allowed to update this cart');

    if (updateCartDto.quantity > product.information.stock)
      throw new BadRequestException('stock quantity must be greater than');

    await this.cartRepository.update(cartExist._id, updateCartDto);
    await this.productRepository.removeStock(
      cartExist.productId,
      updateCartDto.quantity,
    );
  }

  async remove(authAndUser: IAuthAndUser, cart_id: string) {
    const cartExist = await this.cartRepository.findByCartId(cart_id);

    if (!cartExist) throw new NotFoundException('cart not found');

    if (cartExist.userId.toString() != authAndUser.user._id.toString())
      throw new ForbiddenException('You are not allowed to update this cart');

    await this.cartRepository.remove(cartExist._id);
    await this.productRepository.addStock(
      cartExist.productId,
      cartExist.quantity,
    );
  }
}
