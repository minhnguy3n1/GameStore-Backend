/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { PrismaService } from 'prisma/prisma.service';
import { FirebaseStorageProvider } from './firebase-storage.provider';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService, FirebaseStorageProvider],
  exports: [FileService],
})
export class FileModule {}
