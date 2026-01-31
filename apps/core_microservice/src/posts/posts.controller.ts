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
  Patch,
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
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { PostMappers } from './utils/params-mapper.util';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { plainToInstance } from 'class-transformer';
import { PostViewDto } from './dto/post-view.dto';
import { PostLikeDto } from './dto/post-like.dto';
import { PostDetailViewDto } from './dto/post-detail-view';

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
  ) {
    const params = PostMappers.toCreateParams(createPostDto);
    const post = await this.postService.create(params, userId);

    return plainToInstance(PostViewDto, post, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get posts list' })
  @ApiResponse({
    status: 200,
    description: 'Posts list retrieved successfully',
    type: PaginationDto<PostResponseDto>,
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
    @Query('authorProfileId') authorProfileId?: number,
    @CurrentUser('userId') userId?: number,
  ) {
    const params = { page, limit, isArchived, search, userId, authorProfileId };
    const result = await this.postService.findAll(params);

    const transformedData = plainToInstance(PostViewDto, result.data, {
      excludeExtraneousValues: true,
    });

    return {
      data: transformedData,
      meta: result.meta,
    };
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
    @Param('id') id: number,
    @CurrentUser('userId') userId: number,
  ) {
    const result = await this.postService.findOne(id, userId);

    return plainToInstance(PostDetailViewDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
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
  ) {
    const params = PostMappers.toUpdateParams(id, updatePostDto);
    const result = await this.postService.update(params, userId);
    return plainToInstance(PostDetailViewDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
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
    @Param('id') postId: number,
    @CurrentUser('userId') userId: number,
  ) {
    await this.postService.toggleArchive(postId, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post permanently' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 204, description: 'Post deleted permanently' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(
    @CurrentUser('userId') userId: number,
    @Param('id') postId: number,
  ): Promise<void> {
    await this.postService.remove(postId, userId);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like/Unlike post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 201, description: 'Post liked/unliked successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async likePost(
    @CurrentUser('userId') userId: number,
    @Param('id') postId: number,
  ) {
    const result = await this.postService.toggleLikePost(postId, userId);
    return plainToInstance(PostLikeDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
