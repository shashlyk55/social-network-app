import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { ChatParticipantsService } from './chat-participants.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ChatParticipantRole } from 'src/entities/many-to-many/chat-participants.entity';
import { plainToInstance } from 'class-transformer';
import { ChatParticipantDto } from './dto/chat-participant.dto';

@Controller('chats/:chatId/participants')
@UseGuards(AccessGuard)
export class ChatParticipantsController {
  constructor(private readonly participantService: ChatParticipantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addParticipants(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body('profileIds') profileIds: number[],
    @CurrentUser('userId') userId: number,
  ) {
    // const result =
    await this.participantService.addParticipants(chatId, profileIds, userId);

    // return plainToInstance(ChatParticipantDto, result, {
    //   excludeExtraneousValues: true,
    // });
  }

  @Get()
  async getParticipants(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const result = await this.participantService.findAllActive(
      chatId,
      page,
      limit,
    );

    const transformedData = plainToInstance(ChatParticipantDto, result.data, {
      excludeExtraneousValues: true,
    });
    return {
      data: transformedData,
      meta: result.meta,
    };
  }

  @Patch(':profileId/role')
  @HttpCode(HttpStatus.OK)
  async changeRole(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body('role') role: ChatParticipantRole,
    @CurrentUser('userId') userId: number,
  ) {
    await this.participantService.updateRole(chatId, profileId, role, userId);
  }

  @Delete(':profileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeParticipant(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('profileId', ParseIntPipe) profileId: number,
    @CurrentUser('userId') userId: number,
  ) {
    await this.participantService.removeParticipant(chatId, profileId, userId);
  }
}
