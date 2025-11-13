import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCommentLikeDto {
  @ApiProperty({ description: 'Profile ID liking the comment' })
  @IsNumber()
  @IsNotEmpty()
  profileId: number;

  @ApiProperty({ description: 'ID of user creating the like' })
  @IsNumber()
  @IsNotEmpty()
  createdById: number;
}
