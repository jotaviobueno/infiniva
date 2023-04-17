import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from 'src/modules/comment/dto/create-comment.dto';
import { CommentRepository } from 'src/repositories/abstracts/comment/comment.repository';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IComment } from 'src/modules/comment/interfaces/icomment';
import { IOffsetAndLimit } from 'src/modules/pagination/interfaces/ioffset-and-limit';
import { DeleteResult, UpdateResult } from 'mongodb';
import { UpdateCommentDto } from 'src/modules/comment/dto/update-comment.dto';

@Injectable()
export class MongodbCommentRepository implements CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly model: Model<CommentDocument>,
  ) {}

  async create(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = new this.model({ userId, productId, ...createCommentDto });

    return await comment.save();
  }

  async findByCommentId(comment_id: string): Promise<Comment> {
    return await this.model.findOne({ comment_id });
  }

  async findAll(
    productId: Types.ObjectId,
    { offset, limit }: IOffsetAndLimit,
  ): Promise<IComment[]> {
    const pagination = [{ $skip: offset }, { $limit: limit }];
    const pipeline = [
      {
        $match: {
          productId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 0,
                first_name: 0,
                last_name: 0,
                email: 0,
                user_type: 0,
                bio: 0,
                password: 0,
                deletedAt: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: 'comment_owner',
        },
      },
      { $unwind: '$comment_owner' },
      {
        $project: {
          _id: 0,
          userId: 0,
          productId: 0,
          __v: 0,
        },
      },
    ];

    return await this.model.aggregate([...pipeline, ...pagination]);
  }

  async update(
    commentId: Types.ObjectId,
    updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateResult> {
    return await this.model.updateOne(
      { _id: commentId },
      { ...updateCommentDto },
    );
  }

  async remove(commentId: Types.ObjectId): Promise<DeleteResult> {
    return await this.model.deleteOne({ _id: commentId });
  }
}
