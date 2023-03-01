import { UpdateCategoryDto } from './../category/dto/update-cateogory.dto';
import { CreatePublisherDto } from './dto/create-publisher.dto';
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class PublisherService {
  constructor(private prisma: PrismaService) {}

  createPublisher(createCategoryDto: CreatePublisherDto) {
    return this.prisma.publisher.create({
      data: {
        ...createCategoryDto,
      },
    });
  }

  async getAllPublishers() {
    return await this.prisma.publisher.findMany({});
  }

  updatePublisher(publisherId: number, updatePublisherDto: UpdateCategoryDto) {
    return this.prisma.publisher.update({
      where: {
        id: publisherId,
      },
      data: {
        ...updatePublisherDto,
      },
    });
  }
}
