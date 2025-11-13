import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
  //Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere, ILike, In } from 'typeorm';
import {
  CreatePostParams,
  FindAllPostsParams,
  UpdatePostParams,
  FindAllPostsResult,
} from './types/post-service.types';
import { Asset } from 'src/entities/asset.entity';
import { PostAsset } from 'src/entities/many-to-many/post-asset.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { IPostsService } from './interfaces/IPostsService';

@Injectable()
export class PostsService implements IPostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PostAsset)
    private readonly postAssetRepository: Repository<PostAsset>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreatePostParams): Promise<Post> {
    const { authorId, content, location, assetIds } = params;

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: authorId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create post
      const post = this.postRepository.create({
        content,
        location,
        authorId,
      });

      const savedPost = await queryRunner.manager.save(post);

      // Handle attached assets
      if (assetIds && assetIds.length > 0) {
        const assets = await this.assetRepository.find({
          where: {
            id: In(assetIds.map((id) => id)),
            uploaderId: authorId,
          },
        });

        if (assets.length !== assetIds.length) {
          throw new BadRequestException(
            'Some assets not found or do not belong to you',
          );
        }

        const postAssets = assetIds.map((assetId, index) => {
          return this.postAssetRepository.create({
            postId: savedPost.id,
            assetId: assetId,
            order: index,
          });
        });

        await queryRunner.manager.save(postAssets);
      }

      await queryRunner.commitTransaction();

      return await this.findOne(savedPost.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create post: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: FindAllPostsParams): Promise<FindAllPostsResult> {
    const {
      page = 1,
      limit = 10,
      search,
      authorId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = params;

    const where: FindOptionsWhere<Post> = {};

    if (search) {
      where.content = ILike(`%${search}%`);
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const [posts, total] = await this.postRepository.findAndCount({
      where,
      relations: ['author', 'author.profile', 'postAssets', 'postAssets.asset'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages: number = Math.ceil(total / limit);

    console.log(posts);

    return { posts, total, page, limit, totalPages };
  }

  async findByAuthor(
    authorId: number,
    params: FindAllPostsParams,
  ): Promise<FindAllPostsResult> {
    const user = await this.userRepository.findOne({ where: { id: authorId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const authorParams: FindAllPostsParams = {
      ...params,
      authorId,
    };

    return this.findAll(authorParams);
  }

  async findOne(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: [
        'author',
        'author.profile',
        'postAssets',
        'postAssets.asset',
        'comments',
        'comments.author',
        'comments.author.profile',
      ],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return post;
  }

  async update(
    postId: number,
    userId: number,
    params: UpdatePostParams,
  ): Promise<Post> {
    const { ...updateData } = params;

    const post = await this.findOne(postId);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update post fields
      const postUpdateData: Partial<Post> = {};
      if (updateData.content !== undefined)
        postUpdateData.content = updateData.content;
      if (updateData.location !== undefined)
        postUpdateData.location = updateData.location;

      if (Object.keys(postUpdateData).length > 0) {
        await queryRunner.manager.update(Post, postId, postUpdateData);
      }

      // Handle asset updates
      if (updateData.assetIds !== undefined) {
        await queryRunner.manager.delete(PostAsset, { postId });

        if (updateData.assetIds && updateData.assetIds.length > 0) {
          const assets = await this.assetRepository.find({
            where: {
              id: In(updateData.assetIds.map((assetId) => assetId)),
              uploaderId: userId,
            },
          });

          if (assets.length !== updateData.assetIds.length) {
            throw new BadRequestException(
              'Some assets not found or do not belong to you',
            );
          }

          const postAssets = updateData.assetIds.map((assetId, index) => {
            return this.postAssetRepository.create({
              postId,
              assetId,
              order: index,
            });
          });

          await queryRunner.manager.save(postAssets);
        }
      }

      await queryRunner.commitTransaction();

      return await this.findOne(postId);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to update post: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(postId: number, userId: number): Promise<void> {
    const post = await this.findOne(postId);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    try {
      await this.postRepository.delete(postId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete post: ' + error.message,
      );
    }
  }
}
