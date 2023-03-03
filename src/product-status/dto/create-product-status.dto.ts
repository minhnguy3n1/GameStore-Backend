/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateProductStatusDto {
  @IsNotEmpty()
  @IsString()
  statusName: string;
}
