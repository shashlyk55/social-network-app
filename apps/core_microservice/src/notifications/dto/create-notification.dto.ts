import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
  MaxLength,
} from 'class-validator';
import { NotificationType } from 'src/entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({
    example: NotificationType.LIKE,
    description: 'Notification type',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({ example: 'New like', description: 'Notification title' })
  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Someone liked your post',
    description: 'Notification message',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message: string;

  @ApiPropertyOptional({
    example: { postId: 1, profileId: 2 },
    description: 'Additional data for notification',
  })
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiProperty({ description: 'ID of user creating the notification' })
  @IsNotEmpty()
  createdById: number;
}
