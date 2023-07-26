/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';
import { PrismaService } from 'prisma/prisma.service';
import SetNewPasswordDto from 'src/auth/dto/set-new-password.input';
import { CheckUserInput } from './dto/check-user.input';
import { CreateUserInput } from './dto/create-user.input';
import changePasswordDto from 'src/auth/dto/change-password.dto';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        roles: true,
        isEmailValidated: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        email: String(email),
      },
    });
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user) {
      user.password = undefined;
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(createUserInput) {
    const userCheckAvailble = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserInput.email },
          { phone: createUserInput.phone },
        ],
      },
    });

    if (userCheckAvailble) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    try {
      const password = await bcrypt.hash(createUserInput.password, 10);
      return this.prisma.user.create({
        data: {
          ...createUserInput,
          password: password,
        },
      });
    } catch {
      (e) => {
        throw e;
      };
    }
  }

  async checkCreateUser(createUserInput: CheckUserInput) {
    console.log(createUserInput);

    const existEmail = await this.prisma.user.findFirst({
      where: {
        email: createUserInput.email,
      },
    });
    const existPhone = await this.prisma.user.findFirst({
      where: {
        phone: createUserInput.phone,
      },
    });

    let resultEmailCheck = true;
    let resultPhoneCheck = true;

    if (existEmail) {
      resultEmailCheck = false;
    }
    if (existPhone) {
      resultPhoneCheck = false;
    }

    const result = {
      acceptEmailCheck: resultEmailCheck,
      acceptPhoneCheck: resultPhoneCheck,
    };

    return result;
  }

  async markEmailAsConfirmed(email: string) {
    return this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        isEmailValidated: true,
      },
    });
  }

  async setNewPassword(setNewPasswordDto: SetNewPasswordDto) {
    if (
      setNewPasswordDto.newPassword !== setNewPasswordDto.confirmNewPassword
    ) {
      throw new BadRequestException('Password confirm not match');
    }

    const payload = verify(
      setNewPasswordDto.token,
      process.env.JWT_RESETPASSWORD_TOKEN_SECRET,
    );

    if (typeof payload === 'string') {
      throw new BadRequestException('Invalid Token');
    }

    const newPassword = await bcrypt.hash(setNewPasswordDto.newPassword, 10);

    return this.prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        password: newPassword,
      },
    });
  }

  async changePassword(changePasswordDto: changePasswordDto, userId: number) {
    const password = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        password: true,
      }
    })
    const passwordHashed = await bcrypt.hash(changePasswordDto.oldPassword, 10);
    if (password !== passwordHashed) {
      throw new BadRequestException('Old Password not correct!');
    }

    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new BadRequestException('Password confirm not match');
    }

    const newPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      },
    });
  }
}
