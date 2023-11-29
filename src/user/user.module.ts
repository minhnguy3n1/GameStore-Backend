/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';
import { FileService } from 'src/file/file.service';
import { FirebaseStorageProvider } from 'src/file/firebase-storage.provider';
import { StripeModule } from 'src/stripe/stripe.module';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports:[StripeModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, FileService, FirebaseStorageProvider, StripeService],
  exports: [UserService],
})
export class UserModule {}
