import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { IAuthAndUser } from '../auth/interfaces/iauth-and-user';
import { ReqOffsetAndLimit } from '../pagination/decorators/req-offset-and-limit';
import { IOffsetAndLimit } from '../pagination/interfaces/ioffset-and-limit';

@Controller('comment')
@UseGuards(AuthGuard('jwt'))
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:product_id')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('product_id') product_id: string,
    @ReqUser() authAndUser: IAuthAndUser,
  ) {
    return this.commentService.create(
      authAndUser,
      product_id,
      createCommentDto,
    );
  }

  @Get('/:product_id')
  findAll(
    @Param('product_id') product_id: string,
    @ReqOffsetAndLimit() offsetAndLimit: IOffsetAndLimit,
  ) {
    return this.commentService.findAll(product_id, offsetAndLimit);
  }

  @Patch('/:comment_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('comment_id') comment_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(
      authAndUser,
      comment_id,
      updateCommentDto,
    );
  }

  @Delete('/:comment_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @ReqUser() authAndUser: IAuthAndUser,
    @Param('comment_id') comment_id: string,
  ) {
    return this.commentService.remove(authAndUser, comment_id);
  }
}
