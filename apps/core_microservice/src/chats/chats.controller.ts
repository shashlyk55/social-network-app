import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { ChatResponseDto } from './dto/chat-response.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMappers } from './utils/params-mapper.util';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { ChatType } from 'src/entities/chat.entity';

@ApiTags('chats')
@ApiBearerAuth()
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create chat' })
  @ApiResponse({
    status: 201,
    description: 'Chat created successfully',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateChatDto })
  async create(@Body() createChatDto: CreateChatDto): Promise<ChatResponseDto> {
    const params = ChatMappers.toCreateParams(createChatDto);

    const chat = await this.chatService.create(params);
    return ChatMappers.toChatResponse(chat);
  }

  @Get()
  @ApiOperation({ summary: 'Get chats list' })
  @ApiResponse({
    status: 200,
    description: 'Chats list retrieved successfully',
    type: PaginationResponseDto<ChatResponseDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by chat type',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: ChatType,
  ): Promise<PaginationResponseDto<ChatResponseDto>> {
    const params = { page, limit, type };
    const result = await this.chatService.findAll(params);
    return ChatMappers.toPaginationResponse(result);
  }

  @Get('user/:profileId')
  @ApiOperation({ summary: 'Get user chats' })
  @ApiParam({ name: 'profileId', type: Number, description: 'Profile ID' })
  @ApiResponse({
    status: 200,
    description: 'User chats retrieved successfully',
    type: PaginationResponseDto<ChatResponseDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by chat type',
  })
  async findUserChats(
    @Param('profileId') profileId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: ChatType,
  ): Promise<PaginationResponseDto<ChatResponseDto>> {
    const params = { page, limit, type };
    const result = await this.chatService.findUserChats(profileId, params);
    return ChatMappers.toPaginationResponse(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat found',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async findOne(@Param('id') id: number): Promise<ChatResponseDto> {
    const chat = await this.chatService.findOne(id);
    return ChatMappers.toChatResponse(chat);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update chat' })
  @ApiParam({ name: 'id', type: Number, description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat updated successfully',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiBody({ type: UpdateChatDto })
  async update(
    @Param('id') id: number,
    @Body() updateChatDto: UpdateChatDto,
  ): Promise<ChatResponseDto> {
    const params = ChatMappers.toUpdateParams(id, updateChatDto);
    const chat = await this.chatService.update(params);
    return ChatMappers.toChatResponse(chat);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete chat permanently' })
  @ApiParam({ name: 'id', type: Number, description: 'Chat ID' })
  @ApiResponse({ status: 204, description: 'Chat deleted permanently' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiQuery({
    name: 'deletedById',
    required: true,
    type: Number,
    description: 'ID of user performing deletion',
  })
  async remove(
    @Param('id') id: number,
    @Query('deletedById') deletedById: number,
  ): Promise<void> {
    await this.chatService.remove(id);
  }
}
