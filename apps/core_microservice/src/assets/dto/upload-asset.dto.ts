import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { FileType } from 'src/entities/asset.entity';

export class UploadAssetDto {
  @ApiProperty({ enum: FileType, description: 'Type of the file' })
  @IsEnum(FileType)
  fileType: FileType;

  @ApiProperty({ example: 0, description: 'Sorting order index' })
  @IsNumber()
  orderIndex: number;
}
