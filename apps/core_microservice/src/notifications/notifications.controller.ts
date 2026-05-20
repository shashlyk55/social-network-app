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

import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationMappers } from './utils/params-mapper.util';
import { NotificationsService } from './notifications.service';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateNotificationDto })
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const params = NotificationMappers.toCreateParams(createNotificationDto);
    const notification = await this.notificationService.create(params);
    return NotificationMappers.toNotificationResponse(notification);
  }

  @Get()
  @ApiOperation({ summary: 'Get notifications list' })
  @ApiResponse({
    status: 200,
    description: 'Notifications list retrieved successfully',
    type: PaginationResponseDto<NotificationResponseDto>,
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
    enum: NotificationType,
    description: 'Filter by notification type',
  })
  @ApiQuery({
    name: 'isRead',
    required: false,
    type: Boolean,
    description: 'Filter by read status',
  })
  @ApiQuery({
    name: 'createdById',
    required: false,
    type: Number,
    description: 'Filter by creator ID',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: NotificationType,
    @Query('isRead') isRead?: boolean,
    @Query('createdById')
    createdById?: number,
  ): Promise<PaginationResponseDto<NotificationResponseDto>> {
    const params = { page, limit, type, isRead, createdById };
    const result = await this.notificationService.findAll(params);
    return NotificationMappers.toPaginationResponse(result);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User notifications retrieved successfully',
    type: PaginationResponseDto<NotificationResponseDto>,
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
    enum: NotificationType,
    description: 'Filter by notification type',
  })
  @ApiQuery({
    name: 'isRead',
    required: false,
    type: Boolean,
    description: 'Filter by read status',
  })
  async getUserNotifications(
    @Param('userId') userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: NotificationType,
    @Query('isRead') isRead?: boolean,
  ): Promise<PaginationResponseDto<NotificationResponseDto>> {
    const params = { page, limit, type, isRead };
    const result = await this.notificationService.getUserNotifications(
      userId,
      params,
    );
    return NotificationMappers.toPaginationResponse(result);
  }

  @Get('user/:userId/unread-count')
  @ApiOperation({ summary: 'Get user unread notifications count' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(
    @Param('userId') userId: number,
  ): Promise<{ count: number }> {
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification found',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id') id: number): Promise<NotificationResponseDto> {
    const notification = await this.notificationService.findOne(id);
    return NotificationMappers.toNotificationResponse(notification);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiBody({ type: UpdateNotificationDto })
  async update(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const params = NotificationMappers.toUpdateParams(
      id,
      updateNotificationDto,
    );
    const notification = await this.notificationService.update(params);
    return NotificationMappers.toNotificationResponse(notification);
  }

  @Put(':id/mark-read')
  @ApiOperation({ summary: 'Mark notification as read/unread' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiBody({ type: MarkAsReadDto })
  async markAsRead(
    @Param('id') id: number,
    @Body() markAsReadDto: MarkAsReadDto,
  ): Promise<NotificationResponseDto> {
    const params = NotificationMappers.toMarkAsReadParams(id, markAsReadDto);
    const notification = await this.notificationService.markAsRead(params);
    return NotificationMappers.toNotificationResponse(notification);
  }

  @Put('user/:userId/mark-all-read')
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  @ApiQuery({
    name: 'updatedById',
    required: false,
    type: Number,
    description: 'ID of user performing the action',
  })
  async markAllAsRead(
    @Param('userId') userId: number,
    @Query('updatedById')
    updatedById?: number,
  ): Promise<{ affected: number }> {
    return await this.notificationService.markAllAsRead({
      createdById: userId,
      updatedById,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification permanently' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({ status: 204, description: 'Notification deleted permanently' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
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
    await this.notificationService.remove(id, deletedById);
  }
}
