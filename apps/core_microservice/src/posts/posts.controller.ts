// src/posts/controllers/post.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
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
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { PostMappers } from './utils/params-mapper.util';

@ApiTags('posts')
@ApiBearerAuth()
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
  async create(@Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const params = PostMappers.toCreateParams(createPostDto);
    const post = await this.postService.create(params);
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
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('profileId', new ParseIntPipe({ optional: true }))
    profileId?: number,
    @Query('isArchived') isArchived?: boolean,
  ): Promise<PaginationResponseDto<PostResponseDto>> {
    const params = { page, limit, profileId, isArchived };
    const result = await this.postService.findAll(params);
    return PostMappers.toPaginationResponse(result);
  }

  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Get profile posts' })
  @ApiParam({ name: 'profileId', type: Number, description: 'Profile ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile posts retrieved successfully',
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
  async findProfilePosts(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isArchived') isArchived?: boolean,
  ): Promise<PaginationResponseDto<PostResponseDto>> {
    const params = { page, limit, isArchived };
    const result = await this.postService.findProfilePosts(profileId, params);
    return PostMappers.toPaginationResponse(result);
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
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostResponseDto> {
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const params = PostMappers.toUpdateParams(id, updatePostDto);
    const post = await this.postService.update(params);
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
    @Param('id', ParseIntPipe) id: number,
    @Query('updatedById', ParseIntPipe) updatedById: number,
  ): Promise<PostResponseDto> {
    const post = await this.postService.archive(id, updatedById);
    return PostMappers.toPostResponse(post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post permanently' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 204, description: 'Post deleted permanently' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiQuery({
    name: 'deletedById',
    required: true,
    type: Number,
    description: 'ID of user performing deletion',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('deletedById', ParseIntPipe) deletedById: number,
  ): Promise<void> {
    await this.postService.remove(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 201, description: 'Post liked successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 409, description: 'Post already liked' })
  @ApiBody({ type: CreatePostLikeDto })
  async likePost(
    @Param('id', ParseIntPipe) postId: number,
    @Body() createPostLikeDto: CreatePostLikeDto,
  ): Promise<void> {
    const params = PostMappers.toCreatePostLikeParams(
      postId,
      createPostLikeDto,
    );
    await this.postService.likePost(params);
  }
}
