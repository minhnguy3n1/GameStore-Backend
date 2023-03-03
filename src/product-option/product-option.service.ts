import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
/* eslint-disable prettier/prettier */
@Injectable()
export class ProductOptionService {
  constructor(private prisma: PrismaService) {}

  createProductOption(dto: CreateProductOptionDto) {
    const { statusId, productId } = dto;
    
  }
}
