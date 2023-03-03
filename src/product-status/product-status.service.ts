import { UpdateProductStatusDto } from './dto/update-product-status.dto';
/* eslint-disable prettier/prettier */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateProductStatusDto } from './dto/create-product-status.dto';

@Injectable()
export class ProductStatusService {
  constructor(private prisma: PrismaService) {}

  createProductStatus(dto: CreateProductStatusDto) {
    return this.prisma.productStatus.create({
      data: {
        ...dto,
      },
    });
  }

  getAllProductStatus() {
    return this.prisma.productStatus.findMany();
  }

  async updateProductStatus(
    productStatusId: number,
    dto: UpdateProductStatusDto,
  ) {
    const productStatus = await this.prisma.productStatus.findUnique({
      where: {
        id: productStatusId,
      },
    });

    if (!productStatus)
      throw new ForbiddenException('Product Status Not Found');

    return this.prisma.productStatus.update({
      where: {
        id: productStatusId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProductStatus(productStatusId: number) {
    const productStatus = await this.prisma.productStatus.findUnique({
      where: {
        id: productStatusId,
      },
    });

    if (!productStatus)
      throw new ForbiddenException('Product Status Not Found');

    return this.prisma.productStatus.delete({
      where: {
        id: productStatusId,
      },
    });
  }
}
