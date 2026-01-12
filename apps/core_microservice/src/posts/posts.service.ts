import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { Post, Post as PostEntity } from 'src/entities/post.entity';
import { DataSource, In, Repository } from 'typeorm';
import { IPostsService } from './interfaces/IPostsService';
import {
  CreatePostParams,
  FindPostsParams,
  GetFeedParams,
  PostPaginationResult,
  UpdatePostParams,
} from './types/post-service.types';
import {
  PostAccessDeniedException,
  PostNotFoundException,
  PostOperationException,
} from './exceptions/post-domain.exceptions';
import { DomainException } from 'src/app/exceptions/domain.exception';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PostAsset } from 'src/entities/many-to-many/post-asset.entity';
import { FollowService } from 'src/follow/follow.service';

@Injectable()
export class PostsService implements IPostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostAsset)
    private readonly postAssetRepository: Repository<PostAsset>,
    private readonly dataSource: DataSource,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(
    params: CreatePostParams,
    createdById: number,
  ): Promise<PostEntity> {
    const profile = await this.profilesService.findByUserId(createdById);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = this.postRepository.create({
        content: params.content,
        profileId: profile.id,
        isArchived: params.isArchived || false,
        createdById: createdById,
      });

      const savedPost = await queryRunner.manager.save(post);

      if (params.assetIds && params.assetIds.length > 0) {
        const postAssets = params.assetIds.map((assetId, orderIndex) => {
          return this.postAssetRepository.create({
            postId: savedPost.id,
            assetId: assetId,
            createdById: createdById,
            orderIndex: orderIndex,
          });
        });

        await queryRunner.manager.save(PostAsset, postAssets);
      }

      await queryRunner.commitTransaction();

      return await this.findOne(savedPost.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof DomainException) {
        throw error;
      }

      throw new PostOperationException('create post', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    params: FindPostsParams,
    authorId?: number,
    userId?: number,
  ): Promise<PostPaginationResult> {
    const { page = 1, limit = 10, isArchived = false, search } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.profile', 'profile')
      .leftJoinAndSelect('post.postAssets', 'postAssets')
      .leftJoinAndSelect('postAssets.asset', 'asset');

    if (authorId != undefined) {
      queryBuilder.andWhere('post.createdById = :authorId', { authorId });
    }
    if (isArchived !== undefined) {
      queryBuilder.andWhere('post.isArchived = :isArchived', { isArchived });
    }

    if (userId != undefined) {
      queryBuilder.addSelect((subQuery) => {
        return subQuery
          .select('COUNT(l.id) > 0', 'isLiked')
          .from('posts_likes', 'l')
          .where('l.post_id = post.id')
          .andWhere('l.created_by = :currentUserId', {
            currentUserId: userId,
          });
      }, 'post_isLiked');
    }

    if (search) {
      queryBuilder.andWhere('LOWER(post.content) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('post.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(postId: number, userId?: number): Promise<PostEntity> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.profile', 'profile')
      .leftJoinAndSelect('post.postAssets', 'postAssets')
      .leftJoinAndSelect('postAssets.asset', 'asset')
      .where('post.id = :postId', { postId });

    if (userId != undefined) {
      queryBuilder.addSelect((subQuery) => {
        return subQuery
          .select('COUNT(l.id) > 0', 'isLiked')
          .from('posts_likes', 'l')
          .where('l.post_id = post.id')
          .andWhere('l.created_by = :currentUserId', {
            currentUserId: userId,
          });
      }, 'post_isLiked');
    }

    const post = await queryBuilder.getOne();

    if (!post) {
      throw new PostNotFoundException(postId);
    }

    return post;
  }

  async getFollowedFeed(
    params: GetFeedParams,
    userId: number,
  ): Promise<PostPaginationResult> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const profile = await this.profilesService.findByUserId(userId);

    const [data, total] = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.profile', 'profile')
      .leftJoinAndSelect('post.postAssets', 'postAssets')
      .leftJoinAndSelect('postAssets.asset', 'asset')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(l.id) > 0', 'isLiked')
          .from('posts_likes', 'l')
          .where('l.post_id = post.id')
          .andWhere('l.created_by = :currentUserId', { currentUserId: userId });
      }, 'post_isLiked')

      .innerJoin(
        'profiles_follows',
        'follow',
        'follow.followed_profile_id = post.profile_id',
      )
      .leftJoinAndSelect('post.profile', 'author')
      .where('follow.follower_profile_id = :myProfileId', {
        myProfileId: profile.id,
      })
      .andWhere('follow.accepted = :isAccepted', { isAccepted: true })
      .andWhere('post.isArchived = :isArchived', { isArchived: false })
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(params: UpdatePostParams, userId: number): Promise<PostEntity> {
    const { id, assetIds, ...updateData } = params;

    const post = await this.findOne(id);
    if (post.createdById != userId) {
      throw new PostAccessDeniedException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<PostEntity> = {};

      updatePayload.updatedById = userId;
      if (updateData.content !== undefined)
        updatePayload.content = updateData.content;

      if (Object.keys(updatePayload).length > 0) {
        await queryRunner.manager.update(Post, id, updatePayload);
      }

      if (assetIds !== undefined) {
        await queryRunner.manager.delete(PostAsset, { postId: id });

        if (assetIds.length > 0) {
          const newAssets = assetIds.map((assetId) =>
            this.postAssetRepository.create({
              postId: id,
              assetId: assetId,
              createdById: userId,
            }),
          );
          await queryRunner.manager.save(PostAsset, newAssets);
        }
      }

      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof DomainException) {
        throw error;
      }
      throw new PostOperationException('update post', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(postId: number, userId: number): Promise<void> {
    const post = await this.findOne(postId);
    if (post.createdById != userId) {
      throw new PostAccessDeniedException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Post, postId);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof DomainException) {
        throw error;
      }
      throw new PostOperationException('remove post', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async archive(postId: number, userId: number): Promise<PostEntity> {
    const post = await this.findOne(postId);
    if (post.createdById != userId) {
      throw new PostAccessDeniedException();
    }
    try {
      await this.postRepository.update(postId, {
        isArchived: true,
        updatedById: userId,
      });
      return await this.findOne(postId);
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new PostOperationException('archive post', error.message);
    }
  }

  async unarchive(postId: number, userId: number): Promise<PostEntity> {
    const post = await this.findOne(postId);
    if (post.createdById != userId) {
      throw new PostAccessDeniedException();
    }
    try {
      await this.postRepository.update(postId, {
        isArchived: false,
        updatedById: userId,
      });
      return await this.findOne(postId);
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new PostOperationException('unarchive post', error.message);
    }
  }

  async likePost(postId: number, createdById: number): Promise<PostLike> {
    await this.findOne(postId);
    const profile = await this.profilesService.findByUserId(createdById);

    const existingLike = await this.postLikeRepository.findOne({
      where: { postId, profileId: profile.id },
    });

    try {
      if (existingLike) {
        return await this.postLikeRepository.remove(existingLike);
      }

      const like = this.postLikeRepository.create({
        postId,
        profileId: profile.id,
        createdById,
      });

      const savedPostLike = await this.postLikeRepository.save(like);

      return savedPostLike;
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new PostOperationException('like post', error.message);
    }
  }
}
