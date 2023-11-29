/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { FirebaseStorageProvider } from './firebase-storage.provider';

@Injectable()
export class FileService {
  constructor(private storageProvider: FirebaseStorageProvider) {}

  async uploadPublicFile(file: Express.Multer.File): Promise<string> {
    return await this.storageProvider.upload(file, 'images', file.originalname);
  }

  async deletePublicFile(data) {
    return await this.storageProvider.delete(data.fileURL);
  }
}
