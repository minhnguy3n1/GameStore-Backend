/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailverifyService {
  constructor(
    private mailerService: MailerService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  async sendEmailVerify(email: string) {
    const token = sign(email, process.env.JWT_VERIFICATION_TOKEN_SECRET);

    const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;

    return this.mailerService
      .sendMail({
        to: email,
        from: 'minhnngcd191326@fpt.edu.vn',
        subject: 'Verify your account',
        text: 'Verify your account',
        template: './confirmation.hbs',
        context: {
          url: url,
        },
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  async confirmVerify(email: string) {
    const user = this.userService.findByEmail(email);
    if ((await user).isEmailValidated) {
      throw new BadRequestException('Email already confirmed');
    }
    return this.userService.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = verify(token, process.env.JWT_VERIFICATION_TOKEN_SECRET);

      if (payload) {
        return payload.toString();
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async sendMailForResetPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException();
    }

    const token = sign(email, process.env.JWT_RESETPASSWORD_TOKEN_SECRET);

    const url = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

    return this.mailerService
      .sendMail({
        to: email,
        from: `${this.configService.get('EMAIL_TO_SEND')}`,
        subject: 'Reset password for Game Store account',
        text: 'Reset password',
        template: './reset-password.hbs',
        context: {
          firstName: user.firstName,
          url: url,
        },
      })
      .then(() => {})
      .catch(() => {});
  }
}
