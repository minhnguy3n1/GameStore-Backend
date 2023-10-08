import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-publisher.dto';
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
import { PlatformService } from './platform.service';

@Controller('platform')
export class PublisherController {
  constructor(private platformService: PlatformService) {}

  @Get()
  getAllPublishers() {
    return this.platformService.getAllPlatforms();
  }

  @Post()
  createPlatform(@Body() createPlatform: CreatePlatformDto) {
    return this.platformService.createPlatform(createPlatform);
  }

  @Post('add-many')
  createManyPlatforms(@Body() createPlatforms) {
    return this.platformService.createManyPlatforms(createPlatforms);
  }

  @Put(':id')
  updatePublisher(
    @Param('id', ParseIntPipe) platformId: number,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ) {
    return this.platformService.updatePublisher(platformId, updatePlatformDto);
  }
  @Delete(':id')
  deletePublisher(@Param('id', ParseIntPipe) platformId: number) {
    return this.platformService.deletePublisher(platformId);
  }
}
