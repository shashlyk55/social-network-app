// src/posts/utils/mappers.ts
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreatePostLikeDto } from '../dto/create-post-like.dto';
import { PostResponseDto } from '../dto/post-response.dto';
import {
  PaginationResponseDto,
  PaginationMetaDto,
} from '../../common/dto/pagination-response.dto';
import {
  CreatePostParams,
  UpdatePostParams,
  CreatePostLikeParams,
  PostPaginationResult,
} from '../types/post-service.types';
import { Post } from 'src/entities/post.entity';

export class PostMappers {
  static toCreateParams(dto: CreatePostDto): CreatePostParams {
    return {
      content: dto.content,
      profileId: dto.profileId,
      isArchived: dto.isArchived || false,
      createdById: dto.createdById,
      assetIds: dto.assetIds || [],
    };
  }

  static toUpdateParams(id: number, dto: UpdatePostDto): UpdatePostParams {
    return {
      id,
      content: dto.content,
      //isArchived: dto.isArchived,
      updatedById: dto.updatedById,
      assetIds: dto.assetIds,
    };
  }

  static toCreatePostLikeParams(
    postId: number,
    dto: CreatePostLikeDto,
  ): CreatePostLikeParams {
    return {
      postId,
      profileId: dto.profileId,
      createdById: dto.createdById,
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
      },
      // createdBy: {
      //   id: post.createdBy.id,
      //   role: post.createdBy.role,
      // },
      assets: [],
      //likes: [],
      commentsCount: post.comments ? post.comments.length : 0,
      likesCount: post.postLikes ? post.postLikes.length : 0,
    };

    // if (post.updatedBy) {
    //   response.updatedBy = {
    //     id: post.updatedBy.id,
    //     role: post.updatedBy.role,
    //   };
    // }

    if (post.postAssets) {
      response.assets = post.postAssets.map((asset) => ({
        id: asset.id,
        assetId: asset.assetId,
        orderIndex: asset.orderIndex,
        createdAt: asset.createdAt,
      }));
    }

    // if (post.postLikes) {
    //   response.likes = post.postLikes.map((like) => ({
    //     id: like.id,
    //     profileId: like.profileId,
    //     createdAt: like.createdAt,
    //     profile: {
    //       id: like.profile.id,
    //       username: like.profile.username,
    //       displayName: like.profile.displayName,
    //     },
    //   }));
    // }

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
