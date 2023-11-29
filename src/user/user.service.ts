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
import changePasswordDto from 'src/auth/dto/change-password.dto';
import SetNewPasswordDto from 'src/auth/dto/set-new-password.input';
import { FileService } from 'src/file/file.service';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateUserInput } from './dto/create-user.input';

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
    const {
      firstName,
      lastName,
      email,
      isEmailValidated,
      avatarUrl,
      roles,
      password,
    } = createUserInput;
    const userCheckAvailable = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserInput.email }],
      },
    });

    if (userCheckAvailable) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const stripeCustomer = await this.stripe.createCustomer(firstName, email);

    const stripeCustomerId = stripeCustomer.id;

    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        password: passwordHash,
        email: email,
        stripeCustomerId: stripeCustomerId,
        isEmailValidated: isEmailValidated,
        avatarUrl: avatarUrl,
        roles: roles,
      },
    });
  }

  async updateUser(updateUserInput) {
    const { firstName, lastName, email, id, avatarUrl, roles } = updateUserInput;

    const userCheckAvailable = await this.prisma.user.findFirst({
      where: {
        id: updateUserInput.id,
      },
    });

    if (!userCheckAvailable) {
      throw new ForbiddenException('User Not Found');
    }
    //     if (userCheckAvailable.avatarUrl) {
    //  await this.fileService.deletePublicFile(userCheckAvailable.avatarUrl);
    //     }

    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        avatarUrl: avatarUrl,
        firstName: firstName,
        lastName: lastName,
        email: email,
        roles: roles
      },
    });
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

    const newPassword = await bcrypt.hash(setNewPasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: {
        email: payload.toString(),
      },
      data: {
        password: newPassword,
      },
    });

    return 'Reset password successfully'
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
