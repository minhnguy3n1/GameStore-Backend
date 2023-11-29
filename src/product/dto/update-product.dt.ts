/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  platformId: number;

  @IsNotEmpty()
  categoryId: number;

  description?: string;

  @IsNotEmpty()
  price: number;

  image?: string;

  stockId?: number;
}
