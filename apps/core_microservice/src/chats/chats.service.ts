import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, ChatType } from 'src/entities/chat.entity';
import {
  ChatParticipant,
  ChatParticipantRole,
} from 'src/entities/many-to-many/chat-participants.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CreateChatParams,
  FindChatsParams,
  UpdateChatParams,
} from './types/chat-service.types';
import { DomainException } from 'src/app/exceptions/domain.exception';
import {
  ChatNotFoundException,
  ChatOperationException,
} from './exceptions/chat-domain.exceptions';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PaginatedData } from 'src/common/types/paginated-data';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatParticipant)
    private readonly chatParticipantRepository: Repository<ChatParticipant>,
    private readonly profilesService: ProfilesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateChatParams, userId: number): Promise<Chat> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const profile = await this.profilesService.findByUserId(userId);

      if (params.type === ChatType.PRIVATE) {
        if (
          !params.participantProfileIds ||
          params.participantProfileIds.length !== 1
        ) {
          throw new ChatOperationException(
            'create chat',
            'Private chat must have exactly one participant',
          );
        }

        const recipientId = params.participantProfileIds[0];

        const existingChat = await this.findPrivateChatBetween(
          profile.id,
          recipientId,
        );
        if (existingChat) {
          await queryRunner.rollbackTransaction();
          return existingChat;
        }
      }

      const chat = this.chatRepository.create({
        name: params.type === ChatType.GROUP ? params.name : null,
        description:
          params.type === ChatType.GROUP ? params.description || null : null,
        type: params.type,
        createdById: userId,
      });

      const savedChat = await queryRunner.manager.save(Chat, chat);

      if (params.firstMessage) {
        const profile = await this.profilesService.findByUserId(userId);
        const message = queryRunner.manager.create(Message, {
          chatId: savedChat.id,
          profileId: profile.id,
          content: params.firstMessage.content,
          replyToMessageId: params.firstMessage.replyToMessageId,
          createdById: userId,
        });
        await queryRunner.manager.save(message);
      }

      const participantsToCreate: Partial<ChatParticipant>[] = [];

      participantsToCreate.push(
        this.chatParticipantRepository.create({
          chatId: savedChat.id,
          profileId: profile.id,
          role: ChatParticipantRole.CREATOR,
          createdById: userId,
          joinedAt: new Date(),
        }),
      );

      if (
        params.participantProfileIds &&
        params.participantProfileIds.length > 0
      ) {
        const otherParticipantIds = params.participantProfileIds.filter(
          (id) => id !== profile.id,
        );

        otherParticipantIds.forEach((pId) => {
          participantsToCreate.push(
            this.chatParticipantRepository.create({
              chatId: savedChat.id,
              profileId: pId,
              role:
                params.type === ChatType.GROUP
                  ? ChatParticipantRole.MEMBER
                  : ChatParticipantRole.CREATOR,
              createdById: userId,
              joinedAt: new Date(),
            }),
          );
        });
      }

      await queryRunner.manager.save(ChatParticipant, participantsToCreate);

      await queryRunner.commitTransaction();
      return await this.findOne(savedChat.id);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      if (error instanceof DomainException) throw error;
      throw new ChatOperationException('create chat', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  private async findPrivateChatBetween(
    p1: number,
    p2: number,
  ): Promise<Chat | null> {
    return await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.chatParticipants', 'p1', 'p1.profileId = :p1', { p1 })
      .innerJoin('chat.chatParticipants', 'p2', 'p2.profileId = :p2', { p2 })
      .where('chat.type = :type', { type: ChatType.PRIVATE })
      .getOne();
  }

  async findAll(
    params: FindChatsParams,
    userId: number,
  ): Promise<PaginatedData<Chat>> {
    try {
      const { page = 1, limit = 10, type } = params;
      const skip = (page - 1) * limit;

      const profile = await this.profilesService.findByUserId(userId);

      const queryBuilder = this.chatRepository
        .createQueryBuilder('chat')
        .innerJoin(
          'chat.chatParticipants',
          'myPresence',
          'myPresence.profileId = :profileId AND myPresence.joinedAt IS NOT NULL AND myPresence.leftAt IS NULL',
          { profileId: profile.id },
        )
        .leftJoinAndSelect(
          'chat.chatParticipants',
          'participants',
          'chat.type = :privateType AND participants.profileId != :profileId',
          { privateType: ChatType.PRIVATE, profileId: profile.id },
        )
        .leftJoinAndSelect('participants.profile', 'profile');

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
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      if (error instanceof DomainException) throw error;
      throw new ChatOperationException('find chats', error.message);
    }
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.chatParticipants', 'participants')
      .leftJoinAndSelect('participants.profile', 'profile')
      .loadRelationCountAndMap('chat.messagesCount', 'chat.messages')
      .where('chat.id = :id', { id })
      .getOne();

    if (!chat) {
      throw new ChatNotFoundException();
    }
    return chat;
  }

  async update(params: UpdateChatParams, userId: number): Promise<Chat> {
    const { id, ...updateData } = params;

    const chat = await this.findOne(id);
    if (!chat) {
      throw new ChatNotFoundException(id);
    }

    if (updateData.type && updateData.type !== chat.type) {
      throw new ChatOperationException(
        'update chat',
        'Changing chat type is not allowed',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<Chat> = {
        updatedById: userId,
      };

      if (chat.type === ChatType.GROUP) {
        if (updateData.name !== undefined) updatePayload.name = updateData.name;
        if (updateData.description !== undefined)
          updatePayload.description = updateData.description;
      } else {
        updatePayload.name = null;
        updatePayload.description = null;
      }

      await queryRunner.manager.update(Chat, id, updatePayload);

      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      if (error instanceof DomainException) throw error;
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
}
