import { ForbiddenException } from '@nestjs/common';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';
/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductOptionDto } from './dto/create-product-option.dto';

@Injectable()
export class ProductOptionService {
  constructor(private prisma: PrismaService) {}

  createProductOption(dto: CreateProductOptionDto) {
    const { optionName, price, description, avatar, statusId, productId } = dto;
    return this.prisma.productOption.create({
      data: {
        optionName: optionName,
        price: Number(price),
        description: description,
        avatar: avatar,
        productStatus: {
          connect: {
            id: Number(statusId),
          },
        },
        product: {
          connect: {
            id: Number(productId),
          },
        },
      },
    });
  }

  getAllProductOption() {
    return this.prisma.productOption.findMany({
      include: {
        product: {
          select: {
            productName: true,
          },
        },
        productStatus: {
          select: {
            statusName: true,
          },
        },
      },
    });
  }

  updateProductOption(productOptionId: number, dto: UpdateProductOptionDto) {
    const { optionName, price, description, avatar, statusId, productId } = dto;

    const productOption = this.prisma.productOption.findUnique({
      where: {
        id: productOptionId,
      },
    });

    if (!productOption)
      throw new ForbiddenException('Product Option Not Found');

    return this.prisma.productOption.update({
      where: {
        id: productOptionId,
      },
      data: {
        optionName: optionName,
        price: Number(price) ,
        description: description,
        avatar: avatar,
        productStatus: {
          connect: {
            id: Number(statusId),
          },
        },
        product: {
          connect: {
            id: Number(productId),
          },
        },
      },
    });
  }

  deleteProductOption(productOptionId: number) {
    const productOption = this.prisma.productOption.findUnique({
      where: {
        id: productOptionId,
      },
    });

    if (!productOption)
      throw new ForbiddenException('Product Option Not Found');
    return this.prisma.productOption.delete({
      where: {
        id: productOptionId,
      },
    });
  }
}
