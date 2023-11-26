/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CDKeyService } from './cdkey.service';

@Controller('cdkey')
export class CDKeyController {
  constructor(private cdkeyService: CDKeyService) {}

  @Get(':id')
  getCdkeyById(@Param('id', ParseIntPipe) productId) {
    return this.cdkeyService.getCdkey(productId);
  }

  @Post('create')
  async createCDKey(@Body() cdkeys) {
    return this.cdkeyService.createCDKey(cdkeys);
  }

  @Put('update')
  async updateCDKey(@Body() body) {
    return this.cdkeyService.updateCDKey(body);
  }

  @Delete('id')
  deleteCdkey(@Body() body) {
    return this.cdkeyService.deleteCdkey(body.id);
  }
}
