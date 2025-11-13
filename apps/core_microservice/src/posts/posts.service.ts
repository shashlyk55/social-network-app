import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere, ILike, In } from 'typeorm';
import {
  CreatePostParams,
  FindAllPostsParams,
  UpdatePostParams,
  FindAllPostsResult,
  PostIdParams,
  UserPostParams,
  LikePostResult,
  ArchivePostParams,
  FindArchivedPostsParams,
  FindArchivedPostsResult,
} from './types/post-service.types';
import { Asset } from 'src/entities/asset.entity';
import { PostAsset } from 'src/entities/many-to-many/post-asset.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { IPostsService } from './interfaces/IPostsService';
import { PostLike } from 'src/entities/many-to-many/post-like.entity';

@Injectable()
export class PostsService implements IPostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostAsset)
    private readonly postAssetRepository: Repository<PostAsset>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreatePostParams): Promise<Post> {
    const { authorId, content, location, assetIds } = params;

    const user = await this.userRepository.findOne({ where: { id: authorId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = this.postRepository.create({
        content,
        location,
        authorId,
      });

      const savedPost = await queryRunner.manager.save(post);

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

      return await this.findOne({ postId: savedPost.id });
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

    const where: FindOptionsWhere<Post> = { isArchived: false };

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

  async findOne(
    params: PostIdParams & { currentUserId?: number },
  ): Promise<Post> {
    const { postId, currentUserId } = params;

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

    if (post.isArchived && post.authorId !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to view this archived post',
      );
    }

    return post;
  }

  async update(params: UserPostParams & UpdatePostParams): Promise<Post> {
    const { userId, postId, ...updateData } = params;

    const post = await this.findOne({ postId });

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const postUpdateData: Partial<Post> = {};
      if (updateData.content !== undefined)
        postUpdateData.content = updateData.content;
      if (updateData.location !== undefined)
        postUpdateData.location = updateData.location;

      if (Object.keys(postUpdateData).length > 0) {
        await queryRunner.manager.update(Post, postId, postUpdateData);
      }

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

      return await this.findOne({ postId });
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

  async remove(params: UserPostParams): Promise<void> {
    const { userId, postId } = params;

    const post = await this.findOne({ postId });

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

  async incrementCommentsCount(params: PostIdParams): Promise<void> {
    const { postId } = params;
    await this.postRepository.increment({ id: postId }, 'commentsCount', 1);
  }

  async decrementCommentsCount(params: PostIdParams): Promise<void> {
    const { postId } = params;
    await this.postRepository.decrement({ id: postId }, 'commentsCount', 1);
  }

  /**
   * Like a post
   */
  async likePost(params: UserPostParams): Promise<LikePostResult> {
    const { postId, userId } = params;
    const post = await this.findOne({ postId });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingLike = await queryRunner.manager.findOne(PostLike, {
        where: { postId, userId },
      });

      if (existingLike) {
        await queryRunner.manager.delete(PostLike, {
          postId,
          userId,
        });
        await queryRunner.manager.decrement(
          Post,
          { id: postId },
          'likesCount',
          1,
        );
      } else {
        const postLike = this.postLikeRepository.create({
          postId,
          userId,
        });
        await queryRunner.manager.save(postLike);
        await queryRunner.manager.increment(
          Post,
          { id: postId },
          'likesCount',
          1,
        );
      }

      await queryRunner.commitTransaction();

      const updatedPost = await this.postRepository.findOne({
        where: { id: postId },
        select: ['likesCount'],
      });

      if (!updatedPost) {
        throw new NotFoundException('Liked Post not found');
      }

      return {
        liked: !existingLike,
        likesCount: updatedPost.likesCount,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to like post: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Archive or unarchive a post
   */
  async archivePost(params: ArchivePostParams): Promise<Post> {
    const { postId, userId, archive } = params;

    const post = await this.findOne({ postId });

    // Проверяем права на архивацию
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only archive your own posts');
    }

    try {
      if (archive) {
        await this.postRepository.update(postId, {
          isArchived: true,
          archivedAt: new Date(),
        });
      } else {
        await this.postRepository.update(postId, {
          isArchived: false,
          archivedAt: () => 'NULL',
        });
      }

      return await this.findOne({ postId });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to archive post: ' + error.message,
      );
    }
  }

  /**
   * Unarchive a post (alias for archivePost with archive=false)
   */
  async unarchivePost(params: UserPostParams): Promise<Post> {
    const { postId, userId } = params;
    return this.archivePost({ postId, userId, archive: false });
  }

  /**
   * Find archived posts for a user
   */
  async findArchivedPosts(
    params: FindArchivedPostsParams,
  ): Promise<FindArchivedPostsResult> {
    const {
      userId,
      page = 1,
      limit = 10,
      search,
      sortBy = 'archivedAt',
      sortOrder = 'DESC',
    } = params;

    const where: FindOptionsWhere<Post> = {
      authorId: userId,
      isArchived: true,
    };

    // Поиск по контенту
    if (search) {
      where.content = ILike(`%${search}%`);
    }

    const [posts, total] = await this.postRepository.findAndCount({
      where,
      relations: ['author', 'author.profile', 'postAssets', 'postAssets.asset'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages: number = Math.ceil(total / limit);

    return { posts, total, page, limit, totalPages };
  }

  /**
   * Check if post is archived
   */
  async isPostArchived(postId: number): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      select: ['id', 'isArchived'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return post.isArchived;
  }
}
