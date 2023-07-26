/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export default class changePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;
}