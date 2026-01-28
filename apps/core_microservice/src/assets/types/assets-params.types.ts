import { FileType } from 'src/entities/asset.entity';

export type UploadAssetParams = {
  orderIndex: number;
  fileType?: FileType;
};

export type AssetResult = {
  id: number;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  orderIndex: number;
  createdAt: Date;
};
