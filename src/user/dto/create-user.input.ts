/* eslint-disable prettier/prettier */
import { IsEmail } from 'class-validator';

export class CreateUserInput {

  password: string;

  firstName: string;

  lastName: string;

  @IsEmail()
  email: string;

  avatarUrl: string;
}
