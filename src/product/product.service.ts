/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dt';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  createProduct(dto: CreateProductDto) {
    const {
      productName,
      publisherId,
      categoryId,
      avatarURL,
      createdAt,
      price,
      description,
      statusId,
    } = dto;
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
        productStatus: {
          connect: {
            id: Number(statusId),
          },
        },
        price: Number(price),
        description: description,
        avatarURL: avatarURL,
        createdAt: createdAt,
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
        productStatus: {
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
        productStatus: {
          select: {
            statusName: true,
          },
        },
        ProductOption: {},
      },
    });
  }

  async getProductByName(dto: string) {
    const tsquerySpecialChars = /[()|&:*!]/g;
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
    const result = JSON.stringify(
      await this.prisma.product.findMany({
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
          productStatus: {
            select: {
              statusName: true,
            },
          },
          ProductOption: {},
        },
      }),
    );

    return result;
  }

  preprocessSearchTerms(searchTerm: string) {
    const tsquerySpecialChars = /[()|&:*!]/g;
    return searchTerm
      .trim()
      .replace(tsquerySpecialChars, ' ')
      .split(/\s+/)
      .join(' & ');
  }

  async updateProduct(productId: number, dto: UpdateProductDto) {
    const {
      productName,
      publisherId,
      categoryId,
      statusId,
      price,
      description,
      avatarURL,
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

        productStatus: {
          connect: {
            id: Number(statusId),
          },
        },
        price: Number(price),
        description: description,
        avatarURL: avatarURL,
      },
    });
  }

  async search(query: string) {
    const q = await this.prisma
      .$queryRaw`CREATE INDEX fulltext_idx ON Product USING gin(to_tsvector('english', productName))`;

    const results = await this.prisma.$queryRaw`SELECT "public"."Product".*
      FROM  "public"."Product"
      WHERE to_tsvector('english', "Product"."productName") @@ plainto_tsquery('english', ${query})
    `;
    return results;
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
