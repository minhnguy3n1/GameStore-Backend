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
import { CreateStockStatusDto } from './dto/create-stock-status.dto';
import { UpdateStockStatusDto } from './dto/update-stock-status.dto';
import { StockStatusService } from './stock-status.service';

@Controller('stock-status')
export class ProductStatusController {
  constructor(private stockStatusService: StockStatusService) {}

  @Post()
  async createStockStatus(@Body() dto: CreateStockStatusDto) {
    return await this.stockStatusService.createProductStatus(dto);
  }

  @Post('add-many')
  async createManyStockStatus(@Body() stockStatus) {
    return await this.stockStatusService.createManyProductStatus(stockStatus);
  }

  @Get()
  getAllStockStatus() {
    return this.stockStatusService.getAllProductStatus();
  }

  @Put(':id')
  updateStockStatus(
    @Param('id', ParseIntPipe) stockStatusId,
    @Body() dto: UpdateStockStatusDto,
  ) {
    return this.stockStatusService.updateProductStatus(stockStatusId, dto);
  }

  @Delete(':id')
  deleteStockStatus(@Param('id', ParseIntPipe) stockStatusId) {
    return this.stockStatusService.deleteProductStatus(stockStatusId);
  }
}
