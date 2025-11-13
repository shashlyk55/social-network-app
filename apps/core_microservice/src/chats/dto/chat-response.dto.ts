import { ApiProperty } from '@nestjs/swagger';

class ParticipantDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  role: string;

  @ApiProperty()
  user: {
    id: number;
    email: string;
    name: string;
    avatarId?: number;
  };
}

export class ChatResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ required: false })
  avatarId?: number;

  @ApiProperty()
  creatorId: number;

  @ApiProperty()
  creator: {
    id: number;
    name: string;
    email: string;
  };

  @ApiProperty({ type: [ParticipantDto] })
  participants: ParticipantDto[];

  @ApiProperty({ type: [Number] })
  adminIds: number[];

  @ApiProperty()
  participantsCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ChatsListResponseDto {
  @ApiProperty({ type: [ChatResponseDto] })
  chats: ChatResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
