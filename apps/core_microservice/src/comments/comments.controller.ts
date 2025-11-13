import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  CommentResponseDto,
  CommentsListResponseDto,
} from './dto/comment-response.dto';
import { CommentsParamsMapper } from './utils/params-mapper.util';

@ApiTags('comments')
@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully created',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User or Post not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ): Promise<CommentResponseDto> {
    // const userId = req.user.id;
    const userId = 3; // just testing
    const params = CommentsParamsMapper.toCreateCommentParams(
      userId,
      createCommentDto,
    );
    const comment = await this.commentsService.create(params);
    return this.mapToCommentResponseDto(comment);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'postId', required: false, type: Number })
  @ApiQuery({ name: 'authorId', required: false, type: Number })
  @ApiQuery({
    name: 'parentId',
    required: false,
    type: Number,
    description: 'Use "null" for root comments',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'List of comments',
    type: CommentsListResponseDto,
  })
  async findAll(@Query() query: any): Promise<CommentsListResponseDto> {
    const params = CommentsParamsMapper.toFindAllCommentsParams(query);
    const { comments, total, page, limit, totalPages } =
      await this.commentsService.findAll(params);

    return {
      comments: comments.map((comment) =>
        this.mapToCommentResponseDto(comment),
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments by post ID' })
  @ApiParam({ name: 'postId', type: Number, example: 1 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'parentId',
    required: false,
    type: Number,
    description: 'Use "null" for root comments',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'List of post comments',
    type: CommentsListResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findByPost(
    @Param('postId') postId: string,
    @Query() query: any,
  ): Promise<CommentsListResponseDto> {
    const findParams = CommentsParamsMapper.toFindAllCommentsParams(query);
    const params = { postId: +postId, ...findParams };
    const { comments, total, page, limit, totalPages } =
      await this.commentsService.findByPost(params);

    return {
      comments: comments.map((comment) =>
        this.mapToCommentResponseDto(comment),
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Comment found',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: number): Promise<CommentResponseDto> {
    const params = { commentId: +id };
    const comment = await this.commentsService.findOne(params);

    return this.mapToCommentResponseDto(comment);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Comment updated',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ): Promise<CommentResponseDto> {
    const userId = req.user.id;
    const updateParams =
      CommentsParamsMapper.toUpdateCommentParams(updateCommentDto);
    const params = { userId, commentId: +id, ...updateParams };
    const comment = await this.commentsService.update(params);
    return this.mapToCommentResponseDto(comment);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Comment deleted' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id') id: number, @Request() req: any): Promise<void> {
    const userId = req.user.id;
    const params = { userId, commentId: id };
    await this.commentsService.remove(params);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get comments by user ID' })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user comments',
    type: CommentsListResponseDto,
  })
  async findByUser(
    @Param('userId') userId: number,
    @Query() query: any,
  ): Promise<CommentsListResponseDto> {
    const findParams = CommentsParamsMapper.toFindAllCommentsParams(query);
    const params = { authorId: userId, ...findParams };
    const { comments, total, page, limit, totalPages } =
      await this.commentsService.findAll(params);

    return {
      comments: comments.map((comment) =>
        this.mapToCommentResponseDto(comment),
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like or unlike a comment' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Like status updated' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async likeComment(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ liked: boolean; likesCount: number }> {
    // const userId = req.user.id;
    const userId = 3; // just testing
    const params = { commentId: +id, userId };
    return await this.commentsService.likeComment(params);
  }

  /**
   * Map Comment entity to CommentResponseDto
   */
  private mapToCommentResponseDto(comment: any): CommentResponseDto {
    const likesCount = comment.commentLikes
      ? comment.commentLikes.length
      : comment.likesCount || 0;

    return {
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      postId: comment.postId,
      author: {
        id: comment.author?.id,
        email: comment.author?.email,
        name: comment.author?.profile?.name || '',
        avatarId: comment.author?.profile?.avatarId,
      },
      likesCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
