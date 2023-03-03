import { Module } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { ProductStatusController } from './product-status.controller';
import { ProductStatusService } from './product-status.service';

@Module({
  providers: [ProductStatusService, PrismaService],
  controllers: [ProductStatusController],
})
export class ProductStatusModule {}
