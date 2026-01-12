import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostResponseDto } from '../dto/post-response.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import {
  CreatePostParams,
  UpdatePostParams,
  PostPaginationResult,
} from '../types/post-service.types';
import { Post } from 'src/entities/post.entity';

export class PostMappers {
  static toCreateParams(dto: CreatePostDto): CreatePostParams {
    return {
      content: dto.content,
      isArchived: dto.isArchived || false,
      assetIds: dto.assetIds || [],
    };
  }

  static toUpdateParams(id: number, dto: UpdatePostDto): UpdatePostParams {
    return {
      id,
      content: dto.content,
      assetIds: dto.assetIds,
    };
  }

  static toPostResponse(post: Post): PostResponseDto {
    const response: PostResponseDto = {
      id: post.id,
      content: post.content,
      isArchived: post.isArchived,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      profileId: post.profileId,
      createdById: post.createdById,
      updatedById: post.updatedById,
      profile: {
        id: post.profile.id,
        username: post.profile.username,
        displayName: post.profile.displayName,
        avatarUrl: post.profile.avatarUrl,
      },
      assets: [],
      commentsCount: post.commentsCount,
      likesCount: post.likesCount,
      isLiked: post.isLiked || false,
    };

    if (post.postAssets) {
      response.assets = post.postAssets.map((asset) => ({
        id: asset.id,
        assetId: asset.assetId,
        orderIndex: asset.orderIndex,
        createdAt: asset.createdAt,
      }));
    }

    return response;
  }

  static toPaginationResponse(
    result: PostPaginationResult,
  ): PaginationResponseDto<PostResponseDto> {
    return {
      data: result.data.map((post) => this.toPostResponse(post)),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}
