export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
}

export interface Asset {
  id: number;
  orderIndex: number;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  downloadUrl: string;
}

export interface PostAsset {
  id: number;
  orderIndex: number;
  asset: Asset;
}
