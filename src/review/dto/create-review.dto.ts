/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  isPurchased: boolean;

  @IsNotEmpty()
  rating: number;

  @IsNotEmpty()
  productId: number;

  avatarUrl?: string;

  @IsNotEmpty()
  userFullName: string;

  userId: number;
}
