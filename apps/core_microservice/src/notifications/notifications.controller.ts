import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserNotificationResponseDto } from './dto/user-notification.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AccessGuard } from 'src/auth/guards/access.guard';

@ApiTags('notifications')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@UseGuards(AccessGuard)
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
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isRead') isRead?: boolean,
    @CurrentUser('userId') userId?: number,
  ) {
    const params = { page, limit, isRead, recipientId: userId };
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
