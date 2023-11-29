/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { EmailverifyModule } from 'src/emailverify/emailverify.module';
import { StripeService } from 'src/stripe/stripe.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { FileService } from 'src/file/file.service';
import { UserService } from 'src/user/user.service';
import { EmailverifyService } from 'src/emailverify/emailverify.service';
import { StripeModule } from 'src/stripe/stripe.module';
import { FirebaseStorageProvider } from 'src/file/firebase-storage.provider';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, StripeModule, UserModule],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    FileService,
    EmailverifyService,
    StripeService,
    FirebaseStorageProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
