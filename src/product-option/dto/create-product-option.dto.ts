/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from 'class-validator';
export class CreateProductOptionDto {
  @IsString()
  @IsNotEmpty()
  optionName: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  description?: string;

  @IsNotEmpty()
  statusId: number;

  avatar?: string;

  @IsNotEmpty()
  productId: number;
}
