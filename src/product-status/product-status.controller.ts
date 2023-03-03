import { UpdateProductStatusDto } from './dto/update-product-status.dto';
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
} from '@nestjs/common';
import { CreateProductStatusDto } from './dto/create-product-status.dto';
import { ProductStatusService } from './product-status.service';

@Controller('product-status')
export class ProductStatusController {
  constructor(private productStatusService: ProductStatusService) {}

  @Post()
  createProductStatus(@Body() dto: CreateProductStatusDto) {
    return this.productStatusService.createProductStatus(dto);
  }

  @Get()
  getAllProductStatus() {
    return this.productStatusService.getAllProductStatus();
  }

  @Put(':id')
  updateProductStatus(
    @Param('id', ParseIntPipe) productStatusId,
    dto: UpdateProductStatusDto,
  ) {
    return this.productStatusService.updateProductStatus(productStatusId, dto);
  }

  @Delete(':id')
  deleteProductStatus(@Param('id', ParseIntPipe) productStatusId) {
    return this.productStatusService.deleteProductStatus(productStatusId);
  }
}
