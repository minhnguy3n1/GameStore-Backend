/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  publisherId: number;

  @IsNotEmpty()
  categoryId: number;
}
