import { AssetResponseDto } from '../dto/asset-response.dto';
import { UploadAssetDto } from '../dto/upload-asset.dto';
import { AssetResult, UploadAssetParams } from '../types/assets-params.types';

export class AssetMapper {
  static toUploadParams(dto: UploadAssetDto): UploadAssetParams {
    const params: UploadAssetParams = {
      fileType: dto.fileType,
      orderIndex: dto.orderIndex,
    };
    return params;
  }

  static toResponse(result: AssetResult): AssetResponseDto {
    const dto: AssetResponseDto = {
      id: result.id,
      fileName: result.fileName,
      fileType: result.fileType,
      fileSize: result.fileSize,
      orderIndex: result.orderIndex,
      createdAt: result.createdAt,
    };

    return dto;
  }
}
