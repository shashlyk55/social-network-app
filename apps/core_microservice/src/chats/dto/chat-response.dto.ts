import { ApiProperty } from '@nestjs/swagger';

class UserReferenceDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({
    example: 'admin',
    description: 'User role',
    enum: ['member', 'admin', 'creator'],
  })
  role: string;
}

class ParticipantResponseDto {
  @ApiProperty({ example: 1, description: 'Participant ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Profile ID' })
  profileId: number;

  @ApiProperty({ example: 'member', description: 'Participant role' })
  @ApiProperty({
    example: 'member',
    description: 'Participant role',
    enum: ['member', 'admin', 'creator'],
  })
  role: string;

  @ApiProperty({ description: 'Join date' })
  joinedAt: Date;

  @ApiProperty({ description: 'Left date', nullable: true })
  leftAt: Date | null;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who created this participant',
  })
  createdBy: UserReferenceDto;
}

export class ChatResponseDto {
  @ApiProperty({ example: 1, description: 'Chat ID' })
  id: number;

  @ApiProperty({ example: 'General Chat', description: 'Chat name' })
  name: string;

  @ApiProperty({
    example: 'General discussion chat',
    description: 'Chat description',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'group',
    description: 'Chat type',
    enum: ['private', 'group'],
  })
  type: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'Creator ID' })
  createdById: number;

  @ApiProperty({ example: 2, description: 'Updater ID', nullable: true })
  updatedById: number | null;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who created this chat',
  })
  createdBy: UserReferenceDto;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who updated this chat',
    nullable: true,
  })
  updatedBy?: UserReferenceDto;

  @ApiProperty({
    type: [ParticipantResponseDto],
    description: 'Chat participants',
  })
  participants: ParticipantResponseDto[];
}
