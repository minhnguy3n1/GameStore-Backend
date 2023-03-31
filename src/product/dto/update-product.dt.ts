/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  publisherId: number;

  @IsNotEmpty()
  categoryId: number;

  description?: string;

  @IsNotEmpty()
  price: number;

  avatarURL?: string;

  statusId?: number;
}
