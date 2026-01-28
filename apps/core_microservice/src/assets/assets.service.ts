import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset, FileType } from 'src/entities/asset.entity';
import { Repository } from 'typeorm';
import { AssetResult, UploadAssetParams } from './types/assets-params.types';
import { FilesService } from 'src/files/files.service';
import {
  AssetNotFound,
  AssetOperationException,
} from './exceptions/asset.exceptions';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly filesService: FilesService,
  ) {}

  async upload(
    file: Express.Multer.File,
    params: UploadAssetParams,
    userId: number,
  ): Promise<Asset> {
    const uniqueFileName = await this.filesService.uploadFile(file);

    const asset = this.assetRepository.create({
      fileName: file.originalname,
      filePath: uniqueFileName,
      fileType: params.fileType || this.mapMimeTypeToEntity(file.mimetype),
      fileSize: file.size,
      orderIndex: params.orderIndex || 0,
      createdById: userId,
    });

    const savedAsset = await this.assetRepository.save(asset);

    savedAsset.downloadUrl = `http://localhost:3001/assets/download/${asset.id}`;

    await this.assetRepository.save(savedAsset);

    return savedAsset;
  }

  private mapMimeTypeToEntity(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    if (mimeType.startsWith('audio/')) return FileType.AUDIO;
    return FileType.DOCUMENT;
  }

  async delete(assetId: number) {
    const asset = await this.findOne(assetId);

    await this.filesService.deleteFile(asset.filePath);

    await this.assetRepository.remove(asset);
  }

  async findOne(id: number): Promise<Asset> {
    let asset;
    try {
      asset = this.assetRepository.findOne({ where: { id } });
    } catch (error) {
      throw new AssetOperationException('find asset', error.message);
    }
    if (!asset) {
      throw new AssetNotFound(id);
    }
    return asset;
  }

  // TODO: delete method when move to S3
  async getAssetForDownload(id: number) {
    const asset = await this.findOne(id);

    const stream = this.filesService.getFileStream(asset.filePath);

    return {
      stream,
      originalName: asset.fileName,
    };
  }
}
