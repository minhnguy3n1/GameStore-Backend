/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
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
import { StripeService } from 'src/stripe/stripe.service';
import { FileService } from 'src/file/file.service';


@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private stripe: StripeService,
    private fileService: FileService,
  ) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        roles: true,
        isEmailValidated: true,
        avatarUrl: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        email: String(email),
      },
    });
    if (!user) {
      throw new HttpException(
        'Email or Password incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async deleteAllUsers() {
    return this.prisma.user.deleteMany();
  }

  async createManyUser(users) {
    users.forEach(async (user) => {
      const stripeCustomer = await this.stripe.createCustomer(
        user.firstName,
        user.email,
      );

      user.stripeCustomerId = (await stripeCustomer).id;

      const userCheckAvailable = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: user.email }],
        },
      });

      if (userCheckAvailable) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      try {
        const password = await bcrypt.hash(user.password, 10);
        return await this.prisma.user.create({
          data: {
            ...user,
            password: password,
          },
        });
      } catch {
        (e) => {
          throw e;
        };
      }
    });
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
    const userCheckAvailable = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserInput.email }],
      },
    });

    if (userCheckAvailable) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const stripeCustomer = await this.stripe.createCustomer(
      createUserInput.firstName,
      createUserInput.email,
    );

    createUserInput.stripeCustomerId = stripeCustomer.id;

      const password = await bcrypt.hash(createUserInput.password, 10);
      return this.prisma.user.create({
        data: {
          ...createUserInput,
          password: password,
        },
      });
  }

  async updateUser(updateUserInput) {
    const { avatarUrl } = updateUserInput;
    const userCheckAvailable = await this.prisma.user.findFirst({
      where: {
        id: updateUserInput.id,
      },
    });

    if (avatarUrl !== userCheckAvailable.avatarUrl) {
    await this.fileService.deletePublicFile(userCheckAvailable.avatarUrl);
      
    }

    if (!userCheckAvailable) {
      throw new ForbiddenException('Product Not Found');
    }
    try {
      const password = await bcrypt.hash(updateUserInput.password, 10);
      return this.prisma.user.update({
        where: {
          id: updateUserInput.id,
        },
        data: {
          avatarUrl: avatarUrl,
          ...updateUserInput,
          password: password,
        },
      });
    } catch {
      (e) => {
        throw e;
      };
    }
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
    const response = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!bcrypt.compareSync(changePasswordDto.oldPassword, response.password)) {
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

  async deleteUserById(userId) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
