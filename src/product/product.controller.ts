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
import { UpdateProductDto } from './dto/update-product.dt';
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

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) productId) {
    return this.productService.getProductById(productId);
  }

  @Get('search/:name')
  async getProductByName(@Param('name') name: string) {
    return await this.productService.getProductByName(name);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(@UploadedFile() image: Express.Multer.File, @Body() product) {
    const imageURL = await this.fileService.uploadPublicFile(image);
    return this.productService.createProduct(JSON.parse(product.data), imageURL);
  }

  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) productId,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(productId, dto);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) productId) {
    return this.productService.deleteProduct(productId);
  }
}
