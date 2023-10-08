import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PublisherController } from './platform.controller';
import { PlatformService } from './platform.service';

@Module({
  providers: [PlatformService, PrismaService],
  controllers: [PublisherController],
})
export class PublisherModule {}
