import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsService } from 'src/chats/chats.service';
import {
  ChatParticipant,
  ChatParticipantRole,
} from 'src/entities/many-to-many/chat-participants.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import {
  NotEnoughPermissions,
  UserNotInChat,
} from './exceptions/chat-participants-domain.execeptions';
import { PaginatedData } from 'src/common/types/paginated-data';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Chat } from 'src/entities/chat.entity';

@Injectable()
export class ChatParticipantsService {
  constructor(
    @InjectRepository(ChatParticipant)
    private readonly participantRepository: Repository<ChatParticipant>,
    @InjectRepository(Chat)
    private readonly chatsRepository: Repository<Chat>,
    private readonly chatsService: ChatsService,
    private readonly profilesService: ProfilesService,
    private readonly dataSource: DataSource,
  ) {}

  private async getActiveParticipant(chatId: number, profileId: number) {
    const participant = await this.participantRepository.findOne({
      where: { chatId, profileId },
    });
    if (!participant || !participant.joinedAt) return null;
    return participant;
  }

  async findAllActive(
    chatId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedData<ChatParticipant>> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.participantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.profile', 'profile')
      .where('participant.chatId = :chatId', { chatId })
      .andWhere('participant.joinedAt IS NOT NULL')
      .andWhere('participant.leftAt IS NULL')
      .orderBy('participant.role', 'ASC')
      .addOrderBy('participant.joinedAt', 'ASC')
      .skip(skip)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addParticipants(
    chatId: number,
    profileIds: number[],
    currentUserId: number,
  ): Promise<ChatParticipant[]> {
    await this.chatsService.findOne(chatId);

    return await this.dataSource.transaction(async (manager) => {
      const results: ChatParticipant[] = [];

      for (const profileId of profileIds) {
        let participant = await manager.findOne(ChatParticipant, {
          where: { chatId, profileId },
        });

        if (participant) {
          if (participant.joinedAt) continue;

          participant.joinedAt = new Date();
          participant.leftAt = null;
          participant.updatedById = currentUserId;
        } else {
          participant = manager.create(ChatParticipant, {
            chatId,
            profileId,
            role: ChatParticipantRole.MEMBER,
            joinedAt: new Date(),
            leftAt: null,
            createdById: currentUserId,
          });
        }
        results.push(participant);
      }

      return await manager.save(results);
    });
  }

  async updateRole(
    chatId: number,
    targetProfileId: number,
    newRole: ChatParticipantRole,
    currentUserId: number,
  ): Promise<ChatParticipant> {
    const currentUserProfile =
      await this.profilesService.findByUserId(currentUserId);
    const actor = await this.getActiveParticipant(
      chatId,
      currentUserProfile.id,
    );
    const target = await this.getActiveParticipant(chatId, targetProfileId);

    if (!actor) throw new UserNotInChat();
    if (!target) throw new UserNotInChat();

    if (actor.role === ChatParticipantRole.ADMIN) {
      if (newRole === ChatParticipantRole.CREATOR) {
        throw new NotEnoughPermissions(ChatParticipantRole.CREATOR);
      }
    } else if (actor.role !== ChatParticipantRole.CREATOR) {
      throw new NotEnoughPermissions(ChatParticipantRole.ADMIN);
    }

    target.role = newRole;
    target.updatedById = currentUserId;

    return await this.participantRepository.save(target);
  }

  async removeParticipant(
    chatId: number,
    profileId: number,
    currentUserId: number,
  ): Promise<ChatParticipant> {
    return await this.dataSource.transaction(async (manager) => {
      const participantRepo = manager.getRepository(ChatParticipant);

      const participant = await participantRepo.findOne({
        where: { chatId, profileId },
      });

      if (!participant || !participant.joinedAt) {
        throw new UserNotInChat();
      }

      let isChatDeleted = false;

      if (participant.role === ChatParticipantRole.CREATOR) {
        const nextCreator = await participantRepo.findOne({
          where: {
            chatId,
            profileId: Not(profileId),
            joinedAt: Not(IsNull()),
            leftAt: IsNull(),
          },
          order: {
            role: 'ASC',
            joinedAt: 'ASC',
          },
        });

        if (nextCreator) {
          nextCreator.role = ChatParticipantRole.CREATOR;
          await manager.save(nextCreator);
        } else {
          await manager.delete(Chat, chatId);
          isChatDeleted = true;
        }
      }

      if (isChatDeleted) {
        participant.leftAt = new Date();
        participant.joinedAt = null;
        return participant;
      }

      participant.leftAt = new Date();
      participant.joinedAt = null;
      participant.role = ChatParticipantRole.MEMBER;
      participant.updatedById = currentUserId;

      return await manager.save(participant);
    });
  }
}
