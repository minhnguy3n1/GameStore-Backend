/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dt';
import { ReviewService } from 'src/review/review.service';
import { CDKeyService } from 'src/cdkey/cdkey.service';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService, private reviewService: ReviewService, private cdkeyService: CDKeyService, private fileService: FileService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const {
      D
    } = createProductDto;
    const newProduct = await this.prisma.product.create({
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
        price: Number(price),
        description: description,
        image: image,
        createdAt: createdAt,
      },
    });

    await this.reviewService.autoGenerateRatingCount(newProduct.id)

    await this.cdkeyService.createCDKey(newProduct.id)

    return newProduct;
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
        review:{},
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
        review: true,
        rating: {
          orderBy: {
            name: 'asc',
          },
        },
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
      available,
      image
    } = dto;
    //Get Product by Id
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (image !== product.image) {
      await this.fileService.deletePublicFile(product.image);
    } 

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
    
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    await this.fileService.deletePublicFile(product.image);

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
