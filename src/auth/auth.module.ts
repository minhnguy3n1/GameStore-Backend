/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { EmailverifyModule } from 'src/emailverify/emailverify.module';
import { StripeService } from 'src/stripe/stripe.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserModule, PassportModule, EmailverifyModule],
  providers: [AuthService, StripeService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
