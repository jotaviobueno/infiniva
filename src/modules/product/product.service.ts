import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/repositories/abstracts/product/product.repository';
import { StoreService } from '../store/store.service';
import { CategoryService } from '../category/category.service';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { toIProduct } from 'src/common/mappers/product.mapper';
import { IRate } from './interfaces/irate';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';
import { PaginationService } from '../pagination/pagination.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,

    private readonly storeService: StoreService,
    private readonly categoryService: CategoryService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    authAndUser: IAuthAndUser,
    store_id: string,
    createProductDto: CreateProductDto,
  ) {
    const store = await this.storeService.handleGetStore({ store_id });

    if (authAndUser.user._id.toString() !== store.userId.toString())
      throw new ForbiddenException('you not are onwer this store');

    const categories = await this.categoryService.handleCrationCategory(
      authAndUser.user._id,
      createProductDto.categories,
    );

    const onlyId = this.categoryService.onlyId(categories);

    const product = await this.productRepository.create(
      authAndUser.user._id,
      store._id,
      onlyId,
      createProductDto,
    );

    const averate_rating = this.calculateAverageRating(product.rate);

    return toIProduct(product, categories, averate_rating);
  }

  async findAll(offsetAndLimit: IOffsetAndLimit) {
    const products = await this.productRepository.findAll(offsetAndLimit);

    const pagination = this.paginationService.handlePagination(
      products,
      offsetAndLimit,
    );

    return { ...pagination };
  }

  async findByProductId(product_id: string) {
    const product = await this.productRepository.aggregateByProductId(
      product_id,
    );

    if (!product) throw new NotFoundException('Product not found.');

    return product;
  }

  async searchByName(name: string, offsetAndLimit: IOffsetAndLimit) {
    if (!name) throw new BadRequestException('name is required');

    const products = await this.productRepository.searchByName(
      name,
      offsetAndLimit,
    );

    const pagination = this.paginationService.handlePagination(
      products,
      offsetAndLimit,
    );

    return { ...pagination };
  }

  async update(
    authAndUser: IAuthAndUser,
    product_id: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.getProduct(product_id);

    if (authAndUser.user._id.toString() != product.userId.toString())
      throw new ForbiddenException('you do not own this product');

    await this.productRepository.update(product._id, updateProductDto);
  }

  async remove(authAndUser: IAuthAndUser, product_id: string) {
    const product = await this.getProduct(product_id);

    if (authAndUser.user._id.toString() != product.userId.toString())
      throw new ForbiddenException('you do not own this product');

    await this.productRepository.remove(product._id);
  }

  public calculateAverageRating(rate: IRate): number {
    if (
      rate.five != 0 ||
      rate.four != 0 ||
      rate.three != 0 ||
      rate.two != 0 ||
      rate.one != 0
    ) {
      const total = rate.five + rate.four + rate.three + rate.two + rate.one;

      const rating =
        (5 * rate.five +
          4 * rate.four +
          3 * rate.three +
          2 * rate.two +
          1 * rate.one) /
        total;

      return Math.ceil(rating * 100) / 100;
    }

    return 0;
  }

  public async getProduct(product_id: string) {
    const product = await this.productRepository.findByProductId(product_id);

    if (!product) throw new NotFoundException('product not found');

    return product;
  }
}
