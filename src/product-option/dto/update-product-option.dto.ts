/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateProductOptionDto {
  @IsString()
  @IsNotEmpty()
  optionName: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  description?: string;

  avatar?: string;

  productId: number;

  statusId: number;
}
