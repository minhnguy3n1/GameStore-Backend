/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private fileService: FileService,
  ) {}

  @Get()
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get('search/:name')
  async getProductByName(@Param('name') name: string) {
    return await this.productService.getProductByName(name);
  }
  @Post('add-many')
  async createManyProducts(@Body() products) {
    return await this.productService.createManyProducts(products);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() product,
  ) {
    let imageUrl;
    if (image) {
  imageUrl = await this.fileService.uploadPublicFile(image);
}
    return this.productService.createProduct(
      JSON.parse(product.data), imageUrl
    );
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    
    const product = JSON.parse(dto.data);
    if (image) {
      product.image = await this.fileService.uploadPublicFile(image);
    }
    return await this.productService.updateProduct(productId, product);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.deleteProduct(productId);
  }
}
