/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlatformDto {
  @IsNotEmpty()
  @IsString()
  platformName: string;
}
