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

  description?: string;

  @IsNotEmpty()
  price: number;

  createdAt: Date;

  avatarURL?: string;

  statusId?: number;
}
