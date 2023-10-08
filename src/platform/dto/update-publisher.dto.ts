/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlatformDto {
  @IsNotEmpty()
  @IsString()
  platformName: string;
}
