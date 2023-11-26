/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmailverifyService } from 'src/emailverify/emailverify.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import changePasswordDto from './dto/change-password.dto';
import { EmailDto } from './dto/check-email.input';
import { CreateUserInput } from './dto/create-user.input';
import { LoginDto } from './dto/login.dto';
import RefreshTokenDto from './dto/refresh-token.dto';
import SetNewPasswordDto from './dto/set-new-password.input';
import { JwtAuthGuardApi } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private emailverifyService: EmailverifyService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request, @Ip() ip: string, @Body() body: LoginDto) {
    return await this.authService.login(body.email, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @UseGuards(JwtAuthGuardApi)
  @Get('me')
  async reload(@Req() request) {
    return this.userService.getUserById(request.user.userId);
  }

  @Post()
  @Post('register')
  async register(@Body() createUserInput: CreateUserInput) {

    await this.userService.createUser(
      createUserInput,
    );
    this.emailverifyService.sendEmailVerify(
      createUserInput.email,
    );
    return 'Register successfully!';
  }

  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('forgot-password')
  async sendMailForResetPassword(@Body() dto: EmailDto) {
    return await this.emailverifyService.sendMailForResetPassword(dto.email);
  }

  @UseGuards(JwtAuthGuardApi)
  @Post('change-password')
  async resetPassWordResendToken(
    @Req() request,
    @Body() password: changePasswordDto,
  ) {
    return await this.userService.changePassword(password, request.user.userId);
  }

  @Post('reset-password')
  async setNewPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    return await this.userService.setNewPassword(setNewPasswordDto);
  }
}
