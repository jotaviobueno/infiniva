import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { CommentRepository } from 'src/repositories/abstracts/comment/comment.repository';
import { toIComment } from 'src/common/mappers/comment.mapper';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';
import { ProductService } from '../product/product.service';
import { PaginationService } from '../pagination/pagination.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,

    private readonly productService: ProductService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    authAndUser: IAuthAndUser,
    product_id: string,
    createCommentDto: CreateCommentDto,
  ) {
    if (!product_id) throw new BadRequestException('product is required');

    const product = await this.productService.getProduct(product_id);

    const comment = await this.commentRepository.create(
      authAndUser.user._id,
      product._id,
      createCommentDto,
    );

    return toIComment(comment);
  }

  async findAll(product_id: string, offsetAndLimit: IOffsetAndLimit) {
    if (!product_id) throw new BadRequestException('product is required');

    const product = await this.productService.getProduct(product_id);

    const comments = await this.commentRepository.findAll(
      product._id,
      offsetAndLimit,
    );

    const pagination = this.paginationService.handlePagination(
      comments,
      offsetAndLimit,
    );

    return { ...pagination };
  }

  async update(
    authAndUser: IAuthAndUser,
    comment_id: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentRepository.findByCommentId(comment_id);

    if (!comment) throw new NotFoundException('comment not found');

    if (comment.userId.toString() != authAndUser.user._id.toString())
      throw new ForbiddenException("you can't delete a comment you don't own");

    await this.commentRepository.update(comment._id, updateCommentDto);
  }

  async remove(authAndUser: IAuthAndUser, comment_id: string) {
    const comment = await this.commentRepository.findByCommentId(comment_id);

    if (!comment) throw new NotFoundException('comment not found');

    if (comment.userId.toString() != authAndUser.user._id.toString())
      throw new ForbiddenException("you can't delete a comment you don't own");

    await this.commentRepository.remove(comment._id);
  }
}
