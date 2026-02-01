import { Injectable } from '@nestjs/common';
import { IFilesService } from './interfaces/IFilesService';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateDirFailed,
  CreateFileFailed,
  FileNotFound,
} from './exceptions/files.exceptions';
import path from 'path';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class FilesService implements IFilesService {
  private readonly UPLOAD_DIR_NAME = 'local_storage';
  private readonly uploadPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    this.UPLOAD_DIR_NAME,
  );

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch {
      throw new CreateDirFailed();
    }

    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const fullFilePath = path.join(this.uploadPath, uniqueFileName);

    try {
      await fs.writeFile(fullFilePath, file.buffer);
    } catch {
      throw new CreateFileFailed();
    }

    return uniqueFileName;
  }

  async deleteFile(fileName: string): Promise<void> {
    const fullFilePath = path.join(this.uploadPath, fileName);

    try {
      await fs.unlink(fullFilePath);
    } catch {
      console.error(`File ${fileName} not found on disk`);
    }
  }

  getFileStream(fileName: string) {
    const fullFilePath = path.join(this.uploadPath, fileName);

    if (!existsSync(fullFilePath)) {
      throw new FileNotFound();
    }

    return createReadStream(fullFilePath);
  }
}
