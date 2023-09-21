/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmailverifyService } from 'src/emailverify/emailverify.service';
import { StripeService } from 'src/stripe/stripe.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { EmailDto } from './dto/check-email.input';
import { CheckUserInput } from './dto/check-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { LoginDto } from './dto/login.dto';
import RefreshTokenDto from './dto/refresh-token.dto';
import SetNewPasswordDto from './dto/set-new-password.input';
import { JwtAuthGuardApi } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import changePasswordDto from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private emailverifyService: EmailverifyService,
    private stripeService: StripeService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request, @Ip() ip: string, @Body() body: LoginDto) {
    return this.authService.login(body.email, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Post('check-register')
  async checkInputRegister(@Body() checkUserInput: CheckUserInput) {
    return this.userService.checkCreateUser(checkUserInput);
  }

  @UseGuards(JwtAuthGuardApi)
  @Get('me')
  async reload(@Req() request) {
    return this.userService.getUserById(request.user.userId);
  }

  @Post('register')
  async register(@Body() createUserInput: CreateUserInput) {
    const stripeCustomer = await this.stripeService.createCustomer(
      createUserInput.lastName,
      createUserInput.email,
    );
    await this.userService.createUser({
      ...createUserInput,
      stripeCustomerId: stripeCustomer.id,
    });
    await this.emailverifyService.sendEmailVerify(
      createUserInput.email,
      createUserInput.lastName,
    );
    return 'Register successfully!';
  }

  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }


  // @UseGuards(JwtAuthGuardApi)
  @Post('forgot-password')
  async sendMailForResetPassword(@Body() dto: EmailDto) {
    return await this.emailverifyService.sendMailForResetPassword(dto.email);
  }

  @UseGuards(JwtAuthGuardApi)
  @Post('change-password')
  resetPassWordResendToken(@Req() request, @Body() password: changePasswordDto) {
    return this.userService.changePassword(password, request.user.userId);
  }

  @Post('reset-password')
  async setNewPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    return await this.userService.setNewPassword(setNewPasswordDto);
  }
}
