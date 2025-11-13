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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto, PostsListResponseDto } from './dto/post-response.dto';
import { PostsParamsMapper } from './utils/params-mapper.util';

@ApiTags('posts')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post successfully created',
    type: PostResponseDto,
  })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<PostResponseDto> {
    const userId = req.user.id;
    const params = PostsParamsMapper.toCreatePostParams(userId, createPostDto);
    const post = await this.postsService.create(params);
    return this.mapToPostResponseDto(post);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'authorId', required: false, type: Number })
  @ApiQuery({
    name: 'privacy',
    required: false,
    enum: ['public', 'friends', 'private'],
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
    description: 'List of posts',
    type: PostsListResponseDto,
  })
  async findAll(
    @Query() query: any,
    @Request() req: any,
  ): Promise<PostsListResponseDto> {
    const userId = req.user?.id;
    const params = PostsParamsMapper.toFindAllPostsParams(query);
    const { posts, total } = await this.postsService.findAll(params);

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts.map((post) => this.mapToPostResponseDto(post)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts by user ID' })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of user posts',
    type: PostsListResponseDto,
  })
  async findByAuthor(
    @Param('userId') authorId: string,
    @Query() query: any,
    @Request() req: any,
  ): Promise<PostsListResponseDto> {
    const currentUserId = req.user?.id;
    const params = PostsParamsMapper.toFindAllPostsParams(query);
    const { posts, total } = await this.postsService.findByAuthor(
      +authorId,
      params,
    );

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts.map((post) => this.mapToPostResponseDto(post)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostResponseDto,
  })
  async findOne(@Param('id') postId: number): Promise<PostResponseDto> {
    const post = await this.postsService.findOne(postId);
    return this.mapToPostResponseDto(post);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Post updated',
    type: PostResponseDto,
  })
  async update(
    @Param('id') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ): Promise<PostResponseDto> {
    const userId = req.user.id;
    const post = await this.postsService.update(postId, userId, updatePostDto);
    return this.mapToPostResponseDto(post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Post deleted' })
  async remove(
    @Param('id') postId: number,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user.id;
    await this.postsService.remove(postId, userId);
  }

  private mapToPostResponseDto(post: any): PostResponseDto {
    return {
      id: post.id,
      content: post.content,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      sharesCount: post.sharesCount,
      location: post.location,
      authorId: post.authorId,
      author: {
        id: post.author.id,
        email: post.author.email,
        name: post.author.profile?.name || '',
        avatarId: post.author.profile?.avatarId,
      },
      postAssets:
        post.postAssets?.map((pa) => ({
          id: pa.id,
          assetId: pa.assetId,
          order: pa.order,
          asset: {
            id: pa.asset?.id,
            url: pa.asset?.url,
            type: pa.asset?.type,
            filename: pa.asset?.filename,
          },
        })) || [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
