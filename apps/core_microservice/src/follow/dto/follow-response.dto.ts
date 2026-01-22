import { ApiProperty } from '@nestjs/swagger';
import { ProfilePreviewDto } from 'src/profiles/dto/profile-preview.dto';

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
    type: () => ProfilePreviewDto,
    description: 'Данные профиля',
  })
  profile: ProfilePreviewDto;
}
