import { DeleteResult, UpdateResult } from 'mongodb';
import { Types } from 'mongoose';
import { CreateCommentDto } from 'src/modules/comment/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/modules/comment/dto/update-comment.dto';
import { IComment } from 'src/modules/comment/interfaces/icomment';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { Comment } from 'src/repositories/implementations/mongodb/schemas/comment.schema';

export abstract class CommentRepository {
  abstract create(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment>;

  abstract findByCommentId(comment_id: string): Promise<Comment>;

  abstract findAll(
    productId: Types.ObjectId,
    offsetAndLimit: IOffsetAndLimit,
  ): Promise<IComment[]>;

  abstract update(
    commentId: Types.ObjectId,
    updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateResult>;

  abstract remove(commentId: Types.ObjectId): Promise<DeleteResult>;
}
