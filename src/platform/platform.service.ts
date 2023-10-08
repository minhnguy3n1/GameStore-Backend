import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-publisher.dto';
/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformService {
  constructor(private prisma: PrismaService) {}

  async createPlatform(createPlatformDto: CreatePlatformDto) {
    return await this.prisma.platform.create({
      data: {
        ...createPlatformDto,
      },
    });
  }
  async createManyPlatforms(platforms) {
    return await this.prisma.platform.createMany({
      data: platforms,
    });
  }

  async getAllPlatforms() {
    return await this.prisma.platform.findMany();
  }

  async updatePublisher(
    platformId: number,
    updatePlatformDto: UpdatePlatformDto,
  ) {
    //Get publisher by Id
    const publisher = await this.prisma.platform.findUnique({
      where: {
        id: platformId,
      },
    });

    if (!publisher || publisher.id !== platformId)
      throw new ForbiddenException('Publisher not found');

    return this.prisma.platform.update({
      where: {
        id: platformId,
      },
      data: {
        ...updatePlatformDto,
      },
    });
  }

  async deletePublisher(publisherId: number) {
    //Get publisher by Id
    const publisher = await this.prisma.platform.findUnique({
      where: {
        id: publisherId,
      },
    });

    if (!publisher || publisher.id !== publisherId)
      throw new ForbiddenException('Publisher not found');

    return this.prisma.platform.delete({
      where: {
        id: publisherId,
      },
    });
  }
}
