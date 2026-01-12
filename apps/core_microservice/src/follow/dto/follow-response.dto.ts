import { ApiProperty } from '@nestjs/swagger';
import { ProfilePreviewResponseDto } from 'src/profiles/dto/profile-preview-response.dto';

export class FollowResponseDto {
  @ApiProperty({ example: 123, description: 'ID записи в таблице подписок' })
  id: number;

  @ApiProperty({
    example: true,
    description: 'true - подписка активна, false - в ожидании',
  })
  accepted: boolean;

  @ApiProperty({ example: '2024-03-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({
    type: () => ProfilePreviewResponseDto,
    description: 'Данные профиля',
  })
  profile: ProfilePreviewResponseDto;
}
