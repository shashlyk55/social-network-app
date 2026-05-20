import { Expose, Type } from 'class-transformer';
import { AssetDto } from 'src/assets/dto/asset.dto';

export class PostAssetDto {
  @Expose()
  id: number;

  @Expose()
  orderIndex: number;

  @Expose()
  @Type(() => AssetDto)
  asset: AssetDto;
}
