/* eslint-disable prettier/prettier */
import { IsArray, IsEmail } from 'class-validator';

export class CreateUserInput {
  password: string;

  firstName: string;

  lastName: string;

  @IsEmail()
  email: string;

  avatarUrl: string;

  @IsArray()
  roles: string;

  isEmailValidated: boolean;

}
