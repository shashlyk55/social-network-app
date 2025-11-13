import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { ChatResponseDto, ChatsListResponseDto } from './dto/chat-response.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatsParamsMapper } from './utils/params-mapper.util';
import { Chat } from 'src/entities/chat.entity';
import { ChatParticipant } from 'src/entities/many-to-many/chat-participants.entity';

@ApiTags('chats')
@Controller('chats')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({
    status: 201,
    description: 'Chat successfully created',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User or participants not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createChatDto: CreateChatDto,
    @Request() req: any,
  ): Promise<ChatResponseDto> {
    // const userId = req.user.id;
    const userId = 4; // just testin)
    const params = ChatsParamsMapper.toCreateChatParams(userId, createChatDto);
    const chat = await this.chatsService.create(params);
    return this.mapToChatResponseDto(chat);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user chats with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'type', required: false, enum: ['private', 'group'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'updatedAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user chats',
    type: ChatsListResponseDto,
  })
  async findAll(
    @Query() query: any,
    @Request() req: any,
  ): Promise<ChatsListResponseDto> {
    // const userId = req.user.id;
    const userId = 4; // just testing
    const params = ChatsParamsMapper.toFindAllChatsParams({ ...query, userId });
    const { chats, total, page, limit, totalPages } =
      await this.chatsService.findAll(params);

    return {
      chats: chats.map((chat) => this.mapToChatResponseDto(chat)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Chat found',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<ChatResponseDto> {
    const userId = req.user.id;
    const params = { userId, chatId: id };
    const chat = await this.chatsService.findOne(params);
    return this.mapToChatResponseDto(chat);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chat' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Chat updated',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: number,
    @Body() updateChatDto: UpdateChatDto,
    @Request() req: any,
  ): Promise<ChatResponseDto> {
    // const userId = req.user.id;
    const userId = 4; // just testing
    const updateParams = ChatsParamsMapper.toUpdateChatParams(updateChatDto);
    const params = { userId, chatId: id, ...updateParams };
    const chat = await this.chatsService.update(params);
    return this.mapToChatResponseDto(chat);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete chat' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Chat deleted' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id') id: number, @Request() req: any): Promise<void> {
    // const userId = req.user.id;
    const userId = 4; // just testing
    const params = { userId, chatId: id };
    await this.chatsService.remove(params);
  }

  /**
   * Map Chat entity to ChatResponseDto
   */
  private mapToChatResponseDto(chat: Chat): ChatResponseDto {
    const adminIds =
      chat.chatParticipants
        ?.filter((cp: any) => cp.role === 'admin')
        .map((cp: any) => cp.userId) || [];

    const participantsCount = chat.chatParticipants?.length || 0;

    return {
      id: chat.id,
      name: chat.name,
      type: chat.type,
      avatarId: chat.avatarId,
      creatorId: chat.creatorId,
      creator: {
        id: chat.creator.id,
        name: chat.creator.profile?.name || '',
        email: chat.creator.email,
      },
      adminIds,
      participants:
        chat.chatParticipants?.map((cp: ChatParticipant) => ({
          id: cp.id,
          userId: cp.userId,
          role: cp.role,
          user: {
            id: cp.user.id,
            email: cp.user.email,
            name: cp.user.profile?.name || '',
            avatarId: cp.user.profile?.avatarId,
          },
        })) || [],
      participantsCount,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }
}
