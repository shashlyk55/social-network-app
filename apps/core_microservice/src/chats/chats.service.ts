import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { ChatParticipant } from 'src/entities/many-to-many/chat-participants.entity';
import { Repository } from 'typeorm';
import { IChatService } from './interfaces/IChatService';
import {
  CreateChatParams,
  FindChatsParams,
  ChatPaginationResult,
  UpdateChatParams,
} from './types/chat-service.types';

@Injectable()
export class ChatsService implements IChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatParticipant)
    private readonly chatParticipantRepository: Repository<ChatParticipant>,
  ) {}

  async create(params: CreateChatParams): Promise<Chat> {
    const chat = this.chatRepository.create({
      name: params.name,
      description: params.description,
      type: params.type,
      createdById: params.createdById,
    });

    const savedChat = await this.chatRepository.save(chat);

    // Create participants (including creator if their profile is in the list)
    const participantPromises = params.participantProfileIds.map((profileId) =>
      this.chatParticipantRepository.create({
        chatId: savedChat.id,
        profileId,
        role: 'member',
        createdById: params.createdById,
      }),
    );

    await this.chatParticipantRepository.save(participantPromises);

    return await this.findOne(savedChat.id);
  }

  async findAll(params: FindChatsParams): Promise<ChatPaginationResult> {
    const { page = 1, limit = 10, type } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.createdBy', 'createdBy')
      .leftJoinAndSelect('chat.updatedBy', 'updatedBy')
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('participants.createdBy', 'participantCreatedBy');

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
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'updatedBy',
        'participants',
        'participants.createdBy',
        'participants.profile',
      ],
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    return chat;
  }

  async update(params: UpdateChatParams): Promise<Chat> {
    const { id, ...updateData } = params;

    await this.findOne(id);

    const updatePayload: Partial<Chat> = {};
    if (updateData.name !== undefined) updatePayload.name = updateData.name;
    if (updateData.description !== undefined)
      updatePayload.description = updateData.description;
    if (updateData.type !== undefined) updatePayload.type = updateData.type;
    if (updateData.updatedById !== undefined)
      updatePayload.updatedById = updateData.updatedById;

    await this.chatRepository.update(id, updatePayload);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const chat = await this.findOne(id);
    await this.chatRepository.remove(chat);
  }

  async findUserChats(
    profileId: number,
    params: FindChatsParams,
  ): Promise<ChatPaginationResult> {
    const { page = 1, limit = 10, type } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.participants', 'participants')
      .leftJoinAndSelect('chat.createdBy', 'createdBy')
      .leftJoinAndSelect('chat.updatedBy', 'updatedBy')
      .leftJoinAndSelect('chat.participants', 'chatParticipants')
      .leftJoinAndSelect('chatParticipants.createdBy', 'participantCreatedBy')
      .where('participants.profileId = :profileId', { profileId })
      .andWhere('participants.leftAt IS NULL');

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
  }
}
