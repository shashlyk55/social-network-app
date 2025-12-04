import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from 'src/entities/chat.entity';
import { ChatParticipantRole } from 'src/entities/many-to-many/chat-participants.entity';
import { UserRole } from 'src/entities/user.entity';

// class UserReferenceDto {
//   @ApiProperty({ example: 1, description: 'User ID' })
//   id: number;

//   @ApiProperty({
//     example: UserRole.ADMIN,
//     description: 'User role',
//     enum: UserRole,
//   })
//   role: UserRole;
// }

class ParticipantResponseDto {
  @ApiProperty({ example: 1, description: 'Participant ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Profile ID' })
  profileId: number;

  @ApiProperty({ example: 'member', description: 'Participant role' })
  @ApiProperty({
    example: ChatParticipantRole.MEMBER,
    description: 'Participant role',
    enum: ChatParticipantRole,
  })
  role: ChatParticipantRole;

  @ApiProperty({ description: 'Join date' })
  joinedAt: Date;

  @ApiProperty({ description: 'Left date', nullable: true })
  leftAt: Date | null;

  // @ApiProperty({
  //   type: UserReferenceDto,
  //   description: 'User who created this participant',
  // })
  // createdBy: UserReferenceDto;
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
    example: ChatType.GROUP,
    description: 'Chat type',
    enum: ChatType,
  })
  type: ChatType;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'Creator ID' })
  createdById: number;

  @ApiProperty({ example: 2, description: 'Updater ID', nullable: true })
  updatedById: number | null;

  // @ApiProperty({
  //   type: UserReferenceDto,
  //   description: 'User who created this chat',
  // })
  // createdBy: UserReferenceDto;

  // @ApiProperty({
  //   type: UserReferenceDto,
  //   description: 'User who updated this chat',
  //   nullable: true,
  // })
  // updatedBy?: UserReferenceDto;

  @ApiProperty({
    type: [ParticipantResponseDto],
    description: 'Chat participants',
  })
  participants: ParticipantResponseDto[];
}
