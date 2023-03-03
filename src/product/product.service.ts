/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dt';
@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  createProduct(dto: CreateProductDto) {
    const { productName, publisherId, categoryId } = dto;
    return this.prisma.product.create({
      data: {
        productName: productName,
        publisher: {
          connect: {
            id: Number(publisherId),
          },
        },
        category: {
          connect: {
            id: Number(categoryId),
          },
        },
      },
    });
  }
  getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        publisher: {
          select: {
            publisherName: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
      },
    });
  }

  async getProductById(productId: number) {
    const product = this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new ForbiddenException('Product Not Found');
    }
    return await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        publisher: {
          select: {
            publisherName: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
      },
    });
  }

  async updateProduct(productId: number, dto: UpdateProductDto) {
    const { productName, publisherId, categoryId } = dto;
    //Get Product by Id
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new ForbiddenException('Product Not Found');
    }

    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        productName: productName,
        publisher: {
          connect: {
            id: Number(publisherId),
          },
        },
        category: {
          connect: {
            id: Number(categoryId),
          },
        },
      },
    });
  }

  async deleteProduct(productId: number) {
    //Get Product by Id
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product || product.id !== productId) {
      throw new ForbiddenException('Product Not Found');
    }
    return this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }
}
