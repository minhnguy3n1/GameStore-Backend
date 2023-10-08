/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() product) {
    console.log(product.data)
    console.log(file);
    // return this.fileService.uploadPublicFile(file);
  }
}
