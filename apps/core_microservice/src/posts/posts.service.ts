import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { Post, Post as PostEntity } from 'src/entities/post.entity';
import { DataSource, Repository } from 'typeorm';
import { IPostsService } from './interfaces/IPostsService';
import {
  CreatePostParams,
  FindPostsParams,
  PostPaginationResult,
  UpdatePostParams,
} from './types/post-service.types';
import {
  PostNotFoundException,
  PostOperationException,
} from './exceptions/post-domain.exceptions';
import { DomainException } from 'src/app/exceptions/domain.exception';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PostAsset } from 'src/entities/many-to-many/post-asset.entity';
import { AssetsService } from 'src/assets/assets.service';

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
    private readonly assetsService: AssetsService,
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
    userId?: number,
  ): Promise<PostPaginationResult> {
    try {
      const { page = 1, limit = 10, isArchived, search } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.profile', 'profile')
        .leftJoinAndSelect('post.postAssets', 'postAssets')
        .leftJoinAndSelect('postAssets.asset', 'asset')
        .leftJoinAndSelect('post.postLikes', 'postLikes')
        .leftJoinAndSelect('postLikes.profile', 'likeProfile')
        .leftJoinAndSelect('post.comments', 'comments')
        .where('post.isArchived = :isArchived', { isArchived: false });

      if (userId != undefined) {
        queryBuilder.andWhere('post.createdById = :userId', { userId });
      }
      if (isArchived !== undefined) {
        queryBuilder.andWhere('post.isArchived = :isArchived', { isArchived });
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
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new PostOperationException('find posts', error.message);
    }
  }

  async findOne(id: number): Promise<PostEntity> {
    try {
      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.profile', 'profile')
        .leftJoinAndSelect('post.postAssets', 'postAssets')
        .leftJoinAndSelect('postAssets.asset', 'asset')
        .leftJoinAndSelect('post.postLikes', 'postLikes')
        .leftJoinAndSelect('postLikes.profile', 'likeProfile')
        .leftJoinAndSelect('post.comments', 'comments')
        .where('post.id = :postId', { postId: id });

      const post = await queryBuilder.getOne();

      if (!post) {
        throw new PostNotFoundException(id);
      }

      return post;
    } catch (error) {
      if (error instanceof PostNotFoundException) {
        throw error;
      }
      throw new PostOperationException('find post', error.message);
    }
  }

  async update(
    params: UpdatePostParams,
    updatedById: number,
  ): Promise<PostEntity> {
    const { id, assetIds, ...updateData } = params;

    await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<PostEntity> = {};

      updatePayload.updatedById = updatedById;
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
              createdById: updatedById,
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

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Post, id);
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

  async archive(id: number, updatedById: number): Promise<PostEntity> {
    await this.findOne(id);
    try {
      await this.postRepository.update(id, {
        isArchived: true,
        updatedById,
      });
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new PostOperationException('archive post', error.message);
    }
  }

  async unarchive(id: number, updatedById: number): Promise<PostEntity> {
    await this.findOne(id);
    try {
      await this.postRepository.update(id, {
        isArchived: false,
        updatedById,
      });
      return await this.findOne(id);
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
