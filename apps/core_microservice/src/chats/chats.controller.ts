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
  UseGuards,
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
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMappers } from './utils/params-mapper.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChatType } from 'src/entities/chat.entity';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { plainToInstance } from 'class-transformer';
import { ChatDetailDto } from './dto/chat-detail.dto';
import { UpdatedChatDto } from './dto/updated-chat.dto';
import { ChatPreviewDto } from './dto/chat-preview.dto';

@ApiTags('chats')
@ApiBearerAuth()
@UseGuards(AccessGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create chat' })
  @ApiResponse({
    status: 201,
    description: 'Chat created successfully',
    type: ChatDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateChatDto })
  async create(
    @Body() createChatDto: CreateChatDto,
    @CurrentUser('userId') userId: number,
  ) {
    const params = ChatMappers.toCreateParams(createChatDto);
    const result = await this.chatService.create(params, userId);

    return plainToInstance(ChatDetailDto, result, {
      excludeExtraneousValues: true,
      groups: [`userId_${userId}`],
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get chats list' })
  @ApiResponse({
    status: 200,
    description: 'Chats list retrieved successfully',
    type: PaginationDto<ChatPreviewDto>,
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
    @CurrentUser('userId') userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: ChatType,
  ) {
    const params = { page, limit, type };
    const result = await this.chatService.findAll(params, userId);

    const transformedData = plainToInstance(ChatPreviewDto, result.data, {
      excludeExtraneousValues: true,
      groups: [`userId_${userId}`],
    });

    return {
      data: transformedData,
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat found',
    type: ChatDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async findOne(
    @Param('id') id: number,
    @CurrentUser('userId') userId: number,
  ) {
    const result = await this.chatService.findOne(id);
    return plainToInstance(ChatDetailDto, result, {
      excludeExtraneousValues: true,
      groups: [`userId_${userId}`],
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update chat' })
  @ApiParam({ name: 'id', type: Number, description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat updated successfully',
    type: UpdatedChatDto,
  })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiBody({ type: UpdateChatDto })
  async update(
    @Param('id') id: number,
    @Body() updateChatDto: UpdateChatDto,
    @CurrentUser('userId') userId: number,
  ) {
    const params = ChatMappers.toUpdateParams(id, updateChatDto);
    const result = await this.chatService.update(params, userId);
    return plainToInstance(UpdatedChatDto, result, {
      excludeExtraneousValues: true,
    });
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
  async remove(@Param('id') id: number): Promise<void> {
    await this.chatService.remove(id);
  }
}
