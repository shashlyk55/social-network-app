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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { CommentsService } from './comments.service';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentMappers } from './utils/params-mapper.util';

@ApiTags('comments')
@ApiBearerAuth()
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
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const params = CommentMappers.toCreateParams(createCommentDto);
    const comment = await this.commentService.create(params);
    return CommentMappers.toCommentResponse(comment);
  }

  @Get()
  @ApiOperation({ summary: 'Get comments list' })
  @ApiResponse({
    status: 200,
    description: 'Comments list retrieved successfully',
    type: PaginationResponseDto<CommentResponseDto>,
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
    name: 'profileId',
    required: false,
    type: Number,
    description: 'Filter by profile ID',
  })
  @ApiQuery({
    name: 'parentCommentId',
    required: false,
    type: Number,
    description: 'Filter by parent comment ID',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('postId') postId?: number,
    @Query('profileId')
    profileId?: number,
    @Query('parentCommentId')
    parentCommentId?: number,
  ): Promise<PaginationResponseDto<CommentResponseDto>> {
    const params = { page, limit, postId, profileId, parentCommentId };
    const result = await this.commentService.findAll(params);
    return CommentMappers.toPaginationResponse(result);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get post comments' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post comments retrieved successfully',
    type: PaginationResponseDto<CommentResponseDto>,
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
  async findPostComments(
    @Param('postId') postId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginationResponseDto<CommentResponseDto>> {
    const params = { page, limit };
    const result = await this.commentService.findPostComments(postId, params);
    return CommentMappers.toPaginationResponse(result);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get comment replies' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment replies retrieved successfully',
    type: PaginationResponseDto<CommentResponseDto>,
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
  async findCommentReplies(
    @Param('id') commentId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginationResponseDto<CommentResponseDto>> {
    const params = { page, limit };
    const result = await this.commentService.findCommentReplies(
      commentId,
      params,
    );
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
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const params = CommentMappers.toUpdateParams(id, updateCommentDto);
    const comment = await this.commentService.update(params);
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
  @ApiQuery({
    name: 'deletedById',
    required: true,
    type: Number,
    description: 'ID of user performing deletion',
  })
  async remove(
    @Param('id') id: number,
    @Query('deletedById') deletedById: number,
  ): Promise<void> {
    await this.commentService.remove(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like comment' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({ status: 201, description: 'Comment liked successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 409, description: 'Comment already liked' })
  @ApiBody({ type: CreateCommentLikeDto })
  async likeComment(
    @Param('id') commentId: number,
    @Body() createCommentLikeDto: CreateCommentLikeDto,
  ): Promise<void> {
    const params = CommentMappers.toCreateCommentLikeParams(
      commentId,
      createCommentLikeDto,
    );
    await this.commentService.likeComment(params);
  }
}
