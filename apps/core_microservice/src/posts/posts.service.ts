import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
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
  CreatePostLikeParams,
  FindProfilePostsParams,
} from './types/post-service.types';
import { Asset } from 'src/entities/asset.entity';
import {
  PostNotFoundException,
  PostOperationException,
} from './exceptions/post-domain.exceptions';
import { DomainException } from 'src/app/exceptions/domain.exception';
import { Profile } from 'src/entities/profile.entity';
import { ProfileNotFoundException } from 'src/users/exceptions/user.exceptions';

@Injectable()
export class PostsService implements IPostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(Asset)
    private readonly postAssetRepository: Repository<Asset>,
    //private readonly userService: UsersService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreatePostParams): Promise<PostEntity> {
    // TODO: check existing user

    const profile = await this.profileRepository.findOne({
      where: { id: params.profileId },
    });

    if (!profile) {
      throw new ProfileNotFoundException(params.profileId);
    }

    // TODO: check asset existing

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = this.postRepository.create({
        content: params.content,
        profileId: params.profileId,
        isArchived: params.isArchived || false,
        createdById: params.createdById,
      });

      const savedPost = await queryRunner.manager.save(post);

      // TODO: add asset adding in when create post

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

  async findAll(params: FindPostsParams): Promise<PostPaginationResult> {
    try {
      const { page = 1, limit = 10, isArchived } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.profile', 'profile')
        // .leftJoinAndSelect('post.createdBy', 'createdBy')
        // .leftJoinAndSelect('post.updatedBy', 'updatedBy')
        .leftJoinAndSelect('post.postAssets', 'postAssets')
        .leftJoinAndSelect('post.postLikes', 'postLikes')
        //.leftJoinAndSelect('postLikes.profile', 'likeProfile')
        .leftJoinAndSelect('post.comments', 'comments')
        .where('post.isArchived = :isArchived', { isArchived: false });

      if (isArchived !== undefined) {
        queryBuilder.andWhere('post.isArchived = :isArchived', { isArchived });
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

      throw new PostOperationException('create post', error.message);
    }
  }

  async findOne(id: number): Promise<PostEntity> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: [
          'profile',
          // 'createdBy',
          // 'updatedBy',
          'postAssets',
          'postLikes',
          'postLikes.profile',
          'comments',
        ],
      });

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

  async update(params: UpdatePostParams): Promise<PostEntity> {
    const { id, assetIds, ...updateData } = params;

    const post = await this.findOne(id);

    // TODO: check user existing

    // TODO: check asset existing

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<PostEntity> = {};

      if (updateData.content !== undefined)
        updatePayload.content = updateData.content;
      if (updateData.updatedById !== undefined)
        updatePayload.updatedById = updateData.updatedById;

      if (Object.keys(updatePayload).length > 0) {
        await queryRunner.manager.update(Post, id, updatePayload);
      }

      // TODO: add asset updating

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
    const post = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Post, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new PostOperationException('remove post', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async archive(id: number, updatedById: number): Promise<PostEntity> {
    const post = await this.findOne(id);

    // TODO: check user existing

    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    try {
      await this.postRepository.update(id, {
        isArchived: true,
        updatedById,
      });

      //await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      //await queryRunner.rollbackTransaction();
      throw new PostOperationException('archive post', error.message);
    } finally {
      //await queryRunner.release();
    }
  }

  async unarchive(id: number, updatedById: number): Promise<PostEntity> {
    const post = await this.findOne(id);

    // TODO: check user existing

    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    try {
      await this.postRepository.update(id, {
        isArchived: false,
        updatedById,
      });

      //await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      //await queryRunner.rollbackTransaction();
      throw new PostOperationException('unarchive post', error.message);
    } finally {
      //await queryRunner.release();
    }
  }

  async likePost(params: CreatePostLikeParams): Promise<PostLike> {
    const { postId, profileId, createdById } = params;

    const post = await this.findOne(postId);

    const profile = await this.profileRepository.findOne({
      where: { id: params.profileId },
    });

    if (!profile) {
      throw new ProfileNotFoundException(params.profileId);
    }

    const existingLike = await this.postLikeRepository.findOne({
      where: { postId, profileId },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (existingLike) {
        return await queryRunner.manager.remove(PostLike, existingLike);
      }

      const like = this.postLikeRepository.create({
        postId,
        profileId,
        createdById,
      });

      const savedPostLike = await queryRunner.manager.save(PostLike, like);

      await queryRunner.commitTransaction();

      return savedPostLike;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof DomainException) {
        throw error;
      }

      throw new PostOperationException('like post', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findProfilePosts(
    params: FindProfilePostsParams,
  ): Promise<PostPaginationResult> {
    const profile = await this.profileRepository.findOne({
      where: { id: params.profileId },
    });

    if (!profile) {
      throw new ProfileNotFoundException(params.profileId);
    }

    try {
      const { page = 1, limit = 10 } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.profile', 'profile')
        // .leftJoinAndSelect('post.createdBy', 'createdBy')
        // .leftJoinAndSelect('post.updatedBy', 'updatedBy')
        .leftJoinAndSelect('post.postLikes', 'postLikes')
        .leftJoinAndSelect('postLikes.profile', 'likeProfile')
        .leftJoinAndSelect('post.comments', 'comments')
        .where('post.profileId = :profileId', { profileId: params.profileId });

      queryBuilder.andWhere('post.isArchived = :isArchived', {
        isArchived: false,
      });

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
      throw new PostOperationException('find profile posts', error.message);
    }
  }
}
