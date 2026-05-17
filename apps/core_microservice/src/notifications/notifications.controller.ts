import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserNotificationResponseDto } from './dto/user-notification.dto';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications list' })
  @ApiResponse({
    status: 200,
    description: 'Notifications list retrieved successfully',
    type: PaginationDto<UserNotificationResponseDto>,
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
    name: 'isRead',
    required: false,
    type: Boolean,
    description: 'Filter by read status',
  })
  @ApiQuery({
    name: 'recipientId',
    required: false,
    type: Number,
    description: 'Filter by recipient ID',
  })
  async findAll(
    @Query('recipientId') recipientId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isRead') isRead?: boolean,
  ) {
    const params = { page, limit, isRead, recipientId };
    const result = await this.notificationService.findAll(params);

    const transformedData = plainToInstance(
      UserNotificationResponseDto,
      result.data,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      data: transformedData,
      meta: result.meta,
    };
  }
}
