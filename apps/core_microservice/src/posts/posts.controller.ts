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
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { PostMappers } from './utils/params-mapper.util';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('posts')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@UseGuards(AccessGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreatePostDto })
  async create(
    @CurrentUser('userId') userId: number,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const params = PostMappers.toCreateParams(createPostDto);
    const post = await this.postService.create(params, userId);
    return PostMappers.toPostResponse(post);
  }

  @Get()
  @ApiOperation({ summary: 'Get posts list' })
  @ApiResponse({
    status: 200,
    description: 'Posts list retrieved successfully',
    type: PaginationResponseDto<PostResponseDto>,
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
    name: 'profileId',
    required: false,
    type: Number,
    description: 'Filter by profile ID',
  })
  @ApiQuery({
    name: 'isArchived',
    required: false,
    type: Boolean,
    description: 'Filter by archived status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search posts by content',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isArchived') isArchived?: boolean,
    @Query('search') search?: string,
  ): Promise<PaginationResponseDto<PostResponseDto>> {
    const params = { page, limit, isArchived, search };
    const result = await this.postService.findAll(params);
    return PostMappers.toPaginationResponse(result);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get posts list' })
  @ApiResponse({
    status: 200,
    description: 'Posts list retrieved successfully',
    type: PaginationResponseDto<PostResponseDto>,
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
    name: 'isArchived',
    required: false,
    type: Boolean,
    description: 'Filter by archived status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search posts by content',
  })
  async findCurrentUserPosts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isArchived') isArchived?: boolean,
    @Query('search') search?: string,
    @CurrentUser('userId') userId?: number,
  ): Promise<PaginationResponseDto<PostResponseDto>> {
    const params = { page, limit, isArchived, search };
    const result = await this.postService.findAll(params, userId);
    return PostMappers.toPaginationResponse(result);
  }

  @Get('following')
  @ApiOperation({
    summary: 'Получить ленту постов на основе подписок',
    description:
      'Возвращает посты пользователей, на которых подписан текущий пользователь и чьи заявки одобрены.',
  })
  @ApiResponse({
    status: 200,
    type: PaginationResponseDto<PostResponseDto>,
    description: 'Список постов с информацией об авторах',
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
  async getFollowedFeed(
    @CurrentUser('userId') userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginationResponseDto<PostResponseDto>> {
    return PostMappers.toPaginationResponse(
      await this.postService.getFollowedFeed({
        userId,
        limit,
        page,
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: number): Promise<PostResponseDto> {
    const post = await this.postService.findOne(id);
    return PostMappers.toPostResponse(post);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBody({ type: UpdatePostDto })
  async update(
    @CurrentUser('userId') userId: number,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const params = PostMappers.toUpdateParams(id, updatePostDto);
    const post = await this.postService.update(params, userId);
    return PostMappers.toPostResponse(post);
  }

  @Put(':id/archive')
  @ApiOperation({ summary: 'Archive post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post archived successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiQuery({
    name: 'updatedById',
    required: true,
    type: Number,
    description: 'ID of user performing archive',
  })
  async archive(
    @Param('id') id: number,
    @CurrentUser('userId') updatedById: number,
  ): Promise<PostResponseDto> {
    const post = await this.postService.archive(id, updatedById);
    return PostMappers.toPostResponse(post);
  }

  @Put(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post unarchived successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiQuery({
    name: 'updatedById',
    required: true,
    type: Number,
    description: 'ID of user performing unarchive',
  })
  async unarchive(
    @Param('id') id: number,
    @CurrentUser('userId') updatedById: number,
  ): Promise<PostResponseDto> {
    const post = await this.postService.unarchive(id, updatedById);
    return PostMappers.toPostResponse(post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post permanently' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 204, description: 'Post deleted permanently' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.postService.remove(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like/Unlike post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 201, description: 'Post liked/unliked successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async likePost(
    @CurrentUser('userId') userId: number,
    @Param('id') postId: number,
  ): Promise<void> {
    await this.postService.likePost(postId, userId);
  }
}
