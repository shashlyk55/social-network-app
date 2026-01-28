import { Expose } from 'class-transformer';
import { FileType } from 'src/entities/asset.entity';

export class AssetDto {
  @Expose()
  id: number;

  @Expose()
  orderIndex: number;

  @Expose()
  fileName: string;

  @Expose()
  fileType?: FileType;

  @Expose()
  downloadUrl: string;

  @Expose()
  fileSize: number;
}
