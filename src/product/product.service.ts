/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dt';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto, imageURL) {
    const {
      productName,
      platformId,
      categoryId,
      createdAt,
      price,
      description,
      stockId,
      available,
    } = createProductDto;
    console.log(imageURL);
    return await this.prisma.product.create({
      data: {
        productName: productName,
        platform: {
          connect: {
            id: Number(platformId),
          },
        },
        category: {
          connect: {
            id: Number(categoryId),
          },
        },
        stockStatus: {
          connect: {
            id: Number(stockId),
          },
        },
        available: Number(available),
        price: Number(price),
        description: description,
        image: imageURL,
        createdAt: createdAt,
      },
    });
  }

  async createManyProducts(products) {
    return await this.prisma.product.createMany({
      data: products
    });
  }

  async getAllProducts() {
    return await this.prisma.product.findMany({
      include: {
        platform: {
          select: {
            platformName: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        stockStatus: {
          select: {
            statusName: true,
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
      throw new NotFoundException('Product Not Found');
    }
    return await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        platform: {
          select: {
            platformName: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        stockStatus: {
          select: {
            statusName: true,
          },
        },
        ProductOption: {},
      },
    });
  }

  async getProductByName(dto: string) {
    const tsquerySpecialChars = /[()|&:*!-]/g;
    const product = await this.prisma.product.findMany({
      where: {
        productName: {
          search: String(dto)
            .trim()
            .replace(tsquerySpecialChars, ' ')
            .split(/\s+/)
            .join(' & '),
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    return await this.prisma.product.findFirst({
      where: {
        productName: {
          search: String(dto)
            .trim()
            .replace(tsquerySpecialChars, ' ')
            .split(/\s+/)
            .join(' & '),
        },
      },
      include: {
        platform: {
          select: {
            platformName: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        stockStatus: {
          select: {
            statusName: true,
          },
        },
        ProductOption: {},
      },
    });
  }

  async updateProduct(productId: number, dto: UpdateProductDto) {
    const {
      productName,
      platformId,
      categoryId,
      statusId,
      price,
      description,
      image,
      available,
    } = dto;
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
        platform: {
          connect: {
            id: Number(platformId),
          },
        },
        category: {
          connect: {
            id: Number(categoryId),
          },
        },

        stockStatus: {
          connect: {
            id: Number(statusId),
          },
        },
        available: Number(available),
        price: Number(price),
        description: description,
        image: image,
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
