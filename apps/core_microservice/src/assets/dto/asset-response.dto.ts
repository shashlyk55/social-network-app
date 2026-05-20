import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../entities/asset.entity';

export class AssetResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'image.jpg' })
  fileName: string;

  @ApiProperty({ enum: FileType, example: FileType.IMAGE })
  fileType: FileType;

  @ApiProperty({ example: 1024 })
  fileSize: number;

  @ApiProperty({ example: 0 })
  orderIndex: number;

  @ApiProperty()
  createdAt: Date;
}
