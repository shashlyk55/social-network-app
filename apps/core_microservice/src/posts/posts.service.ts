import {
  Injectable,
  Post,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { Post as PostEntity } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { IPostsService } from './interfaces/IPostsService';
import {
  CreatePostParams,
  FindPostsParams,
  PostPaginationResult,
  UpdatePostParams,
  CreatePostLikeParams,
} from './types/post-service.types';

@Injectable()
export class PostsService implements IPostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
  ) {}

  async create(params: CreatePostParams): Promise<PostEntity> {
    const post = this.postRepository.create({
      content: params.content,
      profileId: params.profileId,
      isArchived: params.isArchived || false,
      createdById: params.createdById,
    });

    const savedPost = await this.postRepository.save(post);

    return await this.findOne(savedPost.id);
  }

  async findAll(params: FindPostsParams): Promise<PostPaginationResult> {
    const { page = 1, limit = 10, profileId, isArchived } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.profile', 'profile')
      .leftJoinAndSelect('post.createdBy', 'createdBy')
      .leftJoinAndSelect('post.updatedBy', 'updatedBy')
      .leftJoinAndSelect('post.postAssets', 'postAssets')
      .leftJoinAndSelect('post.postLikes', 'postLikes')
      .leftJoinAndSelect('postLikes.profile', 'likeProfile')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.isArchived = :isArchived', { isArchived: false });

    if (profileId) {
      queryBuilder.andWhere('post.profileId = :profileId', { profileId });
    }

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
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: [
        'profile',
        'createdBy',
        'updatedBy',
        'postAssets',
        'postLikes',
        'postLikes.profile',
        'comments',
      ],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(params: UpdatePostParams): Promise<PostEntity> {
    const { id, assetIds, ...updateData } = params;

    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const updatePayload: Partial<PostEntity> = {};

    if (updateData.content !== undefined)
      updatePayload.content = updateData.content;
    if (updateData.isArchived !== undefined)
      updatePayload.isArchived = updateData.isArchived;
    if (updateData.updatedById !== undefined)
      updatePayload.updatedById = updateData.updatedById;

    await this.postRepository.update(id, updatePayload);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }

  async archive(id: number, updatedById: number): Promise<PostEntity> {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.update(id, {
      isArchived: true,
      updatedById,
    });

    return await this.findOne(id);
  }

  async likePost(params: CreatePostLikeParams): Promise<PostLike> {
    const { postId, profileId, createdById } = params;

    const post = await this.findOne(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.postLikeRepository.findOne({
      where: { postId, profileId },
    });

    if (existingLike) {
      return await this.postLikeRepository.remove(existingLike);
    }

    const like = this.postLikeRepository.create({
      postId,
      profileId,
      createdById,
    });

    return await this.postLikeRepository.save(like);
  }

  async findProfilePosts(
    profileId: number,
    params: FindPostsParams,
  ): Promise<PostPaginationResult> {
    const { page = 1, limit = 10, isArchived } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.profile', 'profile')
      .leftJoinAndSelect('post.createdBy', 'createdBy')
      .leftJoinAndSelect('post.updatedBy', 'updatedBy')
      .leftJoinAndSelect('post.postLikes', 'postLikes')
      .leftJoinAndSelect('postLikes.profile', 'likeProfile')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.profileId = :profileId', { profileId });

    if (isArchived !== undefined) {
      queryBuilder.andWhere('post.isArchived = :isArchived', { isArchived });
    } else {
      queryBuilder.andWhere('post.isArchived = :isArchived', {
        isArchived: false,
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
}
