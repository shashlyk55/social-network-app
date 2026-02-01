import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  // @Get()
  // @ApiOperation({ summary: 'Get notifications list' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Notifications list retrieved successfully',
  //   type: PaginationResponseDto<NotificationResponseDto>,
  // })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   type: Number,
  //   description: 'Page number',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   type: Number,
  //   description: 'Items per page',
  // })
  // @ApiQuery({
  //   name: 'type',
  //   required: false,
  //   enum: NotificationType,
  //   description: 'Filter by notification type',
  // })
  // @ApiQuery({
  //   name: 'isRead',
  //   required: false,
  //   type: Boolean,
  //   description: 'Filter by read status',
  // })
  // @ApiQuery({
  //   name: 'createdById',
  //   required: false,
  //   type: Number,
  //   description: 'Filter by creator ID',
  // })
  // async findAll(
  //   @Query('page') page?: number,
  //   @Query('limit') limit?: number,
  //   @Query('type') type?: NotificationType,
  //   @Query('isRead') isRead?: boolean,
  //   @Query('createdById')
  //   createdById?: number,
  // ): Promise<PaginationResponseDto<NotificationResponseDto>> {
  //   const params = { page, limit, type, isRead, createdById };
  //   const result = await this.notificationService.findAll(params);
  //   return NotificationMappers.toPaginationResponse(result);
  // }
}
