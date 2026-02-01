import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import {
  ChatParticipant,
  ChatParticipantRole,
} from 'src/entities/many-to-many/chat-participants.entity';
import { DataSource, Repository } from 'typeorm';
import { IChatService } from './interfaces/IChatService';
import {
  CreateChatParams,
  FindChatsParams,
  ChatPaginationResult,
  UpdateChatParams,
} from './types/chat-service.types';
import { DomainException } from 'src/app/exceptions/domain.exception';
import {
  ChatNotFoundException,
  ChatOperationException,
} from './exceptions/chat-domain.exceptions';

@Injectable()
export class ChatsService implements IChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatParticipant)
    private readonly chatParticipantRepository: Repository<ChatParticipant>,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateChatParams): Promise<Chat> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const chat = this.chatRepository.create({
        name: params.name,
        description: params.description,
        type: params.type,
        createdById: params.createdById,
      });

      const savedChat = await queryRunner.manager.save(Chat, chat);

      // get createdById from currentUser
      const profileId = params.createdById;

      const chatOwnerParticipant = this.chatParticipantRepository.create({
        chatId: savedChat.id,
        profileId: profileId,
        role: ChatParticipantRole.CREATOR,
        createdById: params.createdById,
      });

      await queryRunner.manager.save(ChatParticipant, chatOwnerParticipant);

      if (
        params.participantProfileIds &&
        params.participantProfileIds.length > 0
      ) {
        console.log(params.participantProfileIds);

        const chatParticipants = params.participantProfileIds.map((profileId) =>
          this.chatParticipantRepository.create({
            chatId: savedChat.id,
            profileId,
            role: ChatParticipantRole.MEMBER,
            createdById: params.createdById,
          }),
        );

        await queryRunner.manager.save(ChatParticipant, chatParticipants);
      }

      await queryRunner.commitTransaction();

      return await this.findOne(savedChat.id);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      if (error instanceof DomainException) {
        throw error;
      }

      throw new ChatOperationException('create chat', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: FindChatsParams): Promise<ChatPaginationResult> {
    try {
      const { page = 1, limit = 10, type } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.chatRepository
        .createQueryBuilder('chat')
        // .leftJoinAndSelect('chat.createdBy', 'createdBy')
        // .leftJoinAndSelect('chat.updatedBy', 'updatedBy')
        .leftJoinAndSelect('chat.chatParticipants', 'participants');
      // .leftJoinAndSelect('participants.createdBy', 'participantCreatedBy');

      if (type) {
        queryBuilder.andWhere('chat.type = :type', { type });
      }

      const [data, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('chat.updatedAt', 'DESC')
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      throw new ChatOperationException('find chats', error.message);
    }
  }

  async findOne(id: number): Promise<Chat> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id },
        relations: [
          // 'createdBy',
          // 'updatedBy',
          'chatParticipants',
          // 'chatParticipants.createdBy',
          'chatParticipants.profile',
        ],
      });

      if (!chat) {
        throw new ChatNotFoundException(id);
      }

      return chat;
    } catch (error: any) {
      if (error instanceof ChatNotFoundException) {
        throw error;
      }
      throw new ChatOperationException('find chat', error.message);
    }
  }

  async update(params: UpdateChatParams): Promise<Chat> {
    const { id, ...updateData } = params;

    const chat = await this.findOne(id);
    if (!chat) {
      throw new ChatNotFoundException(id);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<Chat> = {};
      if (updateData.name !== undefined) updatePayload.name = updateData.name;
      if (updateData.description !== undefined)
        updatePayload.description = updateData.description;
      if (updateData.type !== undefined) updatePayload.type = updateData.type;
      if (updateData.updatedById !== undefined)
        updatePayload.updatedById = updateData.updatedById;

      await queryRunner.manager.update(Chat, id, updatePayload);

      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      if (error instanceof DomainException) {
        throw error;
      }

      throw new ChatOperationException('update chat', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const chat = await this.findOne(id);

    if (!chat) {
      throw new ChatNotFoundException(id);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Chat, id);
      await queryRunner.commitTransaction();
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new ChatOperationException('delete chat', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findUserChats(
    profileId: number,
    params: FindChatsParams,
  ): Promise<ChatPaginationResult> {
    try {
      const { page = 1, limit = 10, type } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.chatRepository
        .createQueryBuilder('chat')
        //.innerJoin('chat.chatParticipants', 'participants')   // use to get chats with all members
        // .leftJoinAndSelect('chat.createdBy', 'createdBy')
        // .leftJoinAndSelect('chat.updatedBy', 'updatedBy')
        .leftJoinAndSelect('chat.chatParticipants', 'chatParticipants')
        //.leftJoinAndSelect('chatParticipants.createdBy', 'participantCreatedBy')
        .where('chatParticipants.profileId = :profileId', { profileId })
        .andWhere('chatParticipants.leftAt IS NULL');

      if (type) {
        queryBuilder.andWhere('chat.type = :type', { type });
      }

      const [data, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('chat.updatedAt', 'DESC')
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      throw new ChatOperationException('find user chats', error.message);
    }
  }
}
