import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { Post } from 'src/entities/post.entity';
import { DataSource, In, Repository } from 'typeorm';
import {
  CreatePostParams,
  FindPostsParams,
  GetFeedParams,
  PostLikeResult,
  PostPaginationResult,
  UpdatePostParams,
} from './types/post-service.types';
import {
  NoAccessToThesePosts,
  PostAccessDeniedException,
  PostNotFoundException,
  PostOperationException,
} from './exceptions/post-domain.exceptions';
import { DomainException } from 'src/app/exceptions/domain.exception';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PostAsset } from 'src/entities/many-to-many/post-asset.entity';
import { PaginatedData } from 'src/common/types/paginated-data';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostAsset)
    private readonly postAssetRepository: Repository<PostAsset>,
    private readonly dataSource: DataSource,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(params: CreatePostParams, createdById: number): Promise<Post> {
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

  async findAll(params: FindPostsParams): Promise<PaginatedData<Post>> {
    const {
      page = 1,
      limit = 10,
      isArchived = false,
      search,
      authorProfileId,
      userId,
    } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.profile', 'profile')
      .leftJoinAndSelect('post.postAssets', 'postAssets')
      .leftJoinAndSelect('postAssets.asset', 'asset');

    if (isArchived) {
      const profile = await this.profilesService.findByUserId(userId!);

      if (authorProfileId !== profile.id) {
        throw PostAccessDeniedException.forManyPosts();
      }

      queryBuilder.andWhere('post.isArchived = :isArchived', {
        isArchived: true,
      });
    } else {
      queryBuilder.andWhere('post.isArchived = :isArchived', {
        isArchived: false,
      });
    }

    if (authorProfileId !== undefined) {
      queryBuilder.andWhere('post.profileId = :authorId', {
        authorId: authorProfileId,
      });
    }

    if (userId !== undefined) {
      queryBuilder.addSelect((subQuery) => {
        return subQuery
          .select('COUNT(l.id) > 0', 'isLiked')
          .from('main.posts_likes', 'l')
          .where('l.post_id = post.id')
          .andWhere('l.created_by = :currentUserId', {
            currentUserId: userId,
          });
      }, 'post_isLiked');
    }

    if (search) {
      queryBuilder.andWhere('post.content ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('postAssets.orderIndex', 'ASC')
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(postId: number, userId?: number): Promise<Post> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.profile', 'profile')
      .leftJoinAndSelect('post.postAssets', 'postAssets')
      .leftJoinAndSelect('postAssets.asset', 'asset')
      .where('post.id = :postId', { postId })
      .addOrderBy('postAssets.orderIndex', 'ASC');

    if (userId !== undefined) {
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
      .addOrderBy('postAssets.orderIndex', 'ASC')
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

  async update(params: UpdatePostParams, userId: number): Promise<Post> {
    const { id, assetIds, ...updateData } = params;

    const post = await this.findOne(id);
    if (post.createdById != userId) {
      throw PostAccessDeniedException.forSinglePost();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<Post> = {};

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

      return await this.findOne(id, userId);
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
      throw PostAccessDeniedException.forSinglePost();
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

  async toggleLikePost(
    postId: number,
    createdById: number,
  ): Promise<PostLikeResult> {
    const profile = await this.profilesService.findByUserId(createdById);

    const existingLike = await this.postLikeRepository.findOne({
      where: { postId, profileId: profile.id },
    });

    try {
      if (existingLike) {
        await this.postLikeRepository.remove(existingLike);
      } else {
        const like = this.postLikeRepository.create({
          postId,
          profileId: profile.id,
          createdById,
        });

        await this.postLikeRepository.save(like);
      }

      const likesCount = await this.postLikeRepository.count({
        where: { postId },
      });

      return {
        postId: postId,
        isLiked: !existingLike,
        likesCount,
      };
    } catch (error) {
      // process Race Condition error in DB
      // If 2 requests coming in one time, just ignore this
      if (error.code === '23505') {
        const likesCount = await this.postLikeRepository.count({
          where: { postId },
        });
        return {
          postId,
          isLiked: true,
          likesCount,
        };
      }

      throw new PostOperationException('like post', error.message);
    }
  }

  async toggleArchive(postId: number, userId: number): Promise<void> {
    const post = await this.findOne(postId, userId);

    if (!post) {
      throw new PostNotFoundException();
    }

    if (post.createdById !== userId) {
      throw PostAccessDeniedException.forSinglePost();
    }

    post.isArchived = !post.isArchived;

    await this.postRepository.save(post);
  }
}
