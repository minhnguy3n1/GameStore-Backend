/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FileService } from 'src/file/file.service';
import { FirebaseStorageProvider } from 'src/file/firebase-storage.provider';

@Module({
  providers: [
    ProductService,
    PrismaService,
    FileService,
    FirebaseStorageProvider,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
