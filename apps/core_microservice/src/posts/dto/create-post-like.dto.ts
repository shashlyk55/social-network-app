import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePostLikeDto {
  @ApiProperty({ description: 'Profile ID liking the post' })
  @IsNumber()
  @IsNotEmpty()
  profileId: number;

  @ApiProperty({ description: 'ID of user creating the like' })
  @IsNumber()
  @IsNotEmpty()
  createdById: number;
}
