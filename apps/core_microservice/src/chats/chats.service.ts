import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { User } from 'src/entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { IChatsService } from './interfaces/IChatService';
import {
  CreateChatParams,
  FindAllChatsParams,
  FindAllChatsResult,
  UserChatParams,
  UpdateChatParams,
} from './types/chat-service.types';
import { ChatParticipant } from 'src/entities/many-to-many/chat-participants.entity';

@Injectable()
export class ChatsService implements IChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChatParticipant)
    private readonly chatParticipantsRepository: Repository<ChatParticipant>,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateChatParams): Promise<Chat> {
    const { creatorId, name, type, participantIds, adminIds, avatarId } =
      params;

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      throw new NotFoundException('Creator user not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const chat = this.chatRepository.create({
        name,
        type,
        creatorId,
        avatarId,
      });

      const savedChat = await queryRunner.manager.save(chat);

      const chatParticipants = this.chatParticipantsRepository.create({
        chatId: chat.id,
        userId: creatorId,
        role: 'creator',
      });

      await queryRunner.manager.save(chatParticipants);

      await queryRunner.commitTransaction();

      return await this.findOne({ userId: creatorId, chatId: savedChat.id });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create chat: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: FindAllChatsParams): Promise<FindAllChatsResult> {
    const {
      page = 1,
      limit = 10,
      userId,
      type,
      search,
      sortBy = 'updatedAt',
      sortOrder = 'DESC',
    } = params;

    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.chatParticipants', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('chat.creator', 'creator')
      .leftJoinAndSelect('creator.profile', 'creatorProfile');

    if (userId) {
      queryBuilder.andWhere('participant.userId = :userId', { userId });
    }

    if (type) {
      queryBuilder.andWhere('chat.type = :type', { type });
    }

    if (search) {
      queryBuilder.andWhere('chat.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [chats, total] = await queryBuilder
      .orderBy(`chat.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages: number = Math.ceil(total / limit);

    console.log(chats);

    return { chats, total, page, limit, totalPages };
  }

  async findOne(params: UserChatParams): Promise<Chat> {
    const { userId, chatId } = params;

    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: [
        'creator',
        'creator.profile',
        'chatParticipants',
        'chatParticipants.user',
        'chatParticipants.user.profile',
      ],
    });

    if (!chat) {
      throw new NotFoundException(`Chat not found`);
    }

    const isParticipant = chat.chatParticipants.some(
      (cp) => cp.userId === userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant of this chat');
    }

    return chat;
  }

  async update(params: UserChatParams & UpdateChatParams): Promise<Chat> {
    const { userId, chatId, name, avatarId } = params;

    const chat = await this.findOne({ userId, chatId });

    if (!chat) {
      throw new NotFoundException(`Chat not found`);
    }

    const participant = chat.chatParticipants.find(
      (cp) => cp.userId === userId,
    );
    if (
      !participant ||
      (participant.role !== 'admin' && chat.creatorId !== userId)
    ) {
      throw new ForbiddenException('Only admins and creator can update chat');
    }

    try {
      const updateData: Partial<Chat> = {};
      if (name !== undefined) updateData.name = name;
      if (avatarId !== undefined) updateData.avatarId = avatarId;

      await this.chatRepository.update(chatId, updateData);

      return await this.findOne({ userId, chatId });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update chat: ' + error.message,
      );
    }
  }

  async remove(params: UserChatParams): Promise<void> {
    const { userId, chatId } = params;

    const chat = await this.findOne({ userId, chatId });

    if (chat.creatorId !== userId) {
      throw new ForbiddenException('Only chat creator can delete the chat');
    }

    try {
      await this.chatRepository.delete(chatId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete chat: ' + error.message,
      );
    }
  }
}
