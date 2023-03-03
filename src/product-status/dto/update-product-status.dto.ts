/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateProductStatusDto {
  @IsNotEmpty()
  @IsString()
  statusName: string;
}
