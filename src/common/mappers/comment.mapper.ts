import { IComment } from 'src/modules/comment/interfaces/icomment';
import { Comment } from 'src/repositories/implementations/mongodb/schemas/comment.schema';

export function toIComment(comment: Comment): IComment {
  return {
    comment_id: comment.comment_id,
    body: comment.body,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}
