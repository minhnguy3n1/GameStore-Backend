import { CDKeyService } from './cdkey.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CDKeyController } from './cdkey.controller';

@Module({
  providers: [PrismaService, CDKeyService],
  controllers: [CDKeyController],
})
export class CdkeyModule {}
