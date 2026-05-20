import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CommentsService } from './comments.service';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentMappers } from './utils/params-mapper.util';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('comments')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@UseGuards(AccessGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Parent comment not found' })
  @ApiBody({ type: CreateCommentDto })
  async create(
    @CurrentUser('userId') userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const params = CommentMappers.toCreateParams(createCommentDto);
    const comment = await this.commentService.create(userId, params);
    return CommentMappers.toCommentResponse(comment);
  }

  @Get()
  @ApiOperation({ summary: 'Get comments list' })
  @ApiResponse({
    status: 200,
    description: 'Comments list retrieved successfully',
    type: PaginationDto<CommentResponseDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'postId',
    required: false,
    type: Number,
    description: 'Filter by post ID',
  })
  @ApiQuery({
    name: 'parentCommentId',
    required: false,
    type: Number,
    description: 'Filter by parent comment ID',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description: 'Sort order',
  })
  async findAll(
    @CurrentUser('userId') userId?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('postId') postId?: number,
    @Query('parentCommentId') parentCommentId?: number,
    @Query('order') order?: 'ASC' | 'DESC',
  ): Promise<PaginationDto<CommentResponseDto>> {
    const params = { page, limit, postId, parentCommentId, order };
    const result = await this.commentService.findAll(params, userId);
    return CommentMappers.toPaginationResponse(result);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get post comments' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post comments retrieved successfully',
    type: PaginationDto<CommentResponseDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description: 'Sort order',
  })
  async findPostComments(
    @Param('postId') postId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('order') order?: 'ASC' | 'DESC',
  ): Promise<PaginationDto<CommentResponseDto>> {
    const params = { postId, page, limit, order };
    const result = await this.commentService.findAll(params);
    return CommentMappers.toPaginationResponse(result);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get comment replies' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment replies retrieved successfully',
    type: PaginationDto<CommentResponseDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description: 'Sort order',
  })
  async findCommentReplies(
    @Param('id') commentId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('order') order?: 'ASC' | 'DESC',
  ): Promise<PaginationDto<CommentResponseDto>> {
    const params = { commentId, page, limit, order };
    const result = await this.commentService.findAll(params);
    return CommentMappers.toPaginationResponse(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment found',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: number): Promise<CommentResponseDto> {
    const comment = await this.commentService.findOne(id);
    return CommentMappers.toCommentResponse(comment);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiBody({ type: UpdateCommentDto })
  async update(
    @CurrentUser('userId') userId: number,
    @Param('id') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const params = CommentMappers.toUpdateParams(updateCommentDto);
    const comment = await this.commentService.update(userId, commentId, params);
    return CommentMappers.toCommentResponse(comment);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete comment permanently' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({ status: 204, description: 'Comment deleted permanently' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete comment with replies',
  })
  async remove(
    @CurrentUser('userId') userId: number,
    @Param('id') commentId: number,
  ): Promise<void> {
    await this.commentService.remove(userId, commentId);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Like/Unlike comment' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({ status: 204, description: 'Comment liked successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 409, description: 'Comment already liked' })
  async likeComment(
    @CurrentUser('userId') userId: number,
    @Param('id') commentId: number,
  ): Promise<void> {
    await this.commentService.likeComment(userId, commentId);
  }
}
