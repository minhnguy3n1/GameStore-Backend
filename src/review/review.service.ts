/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async createReview(review: CreateReviewDto) {
    const isPurchased = await this.prisma.invoice.findFirstOrThrow({
      where: {
        userId: review.userId,
      },
    });

    if (isPurchased) review.isPurchased = true;

    const reviewCreated = await this.prisma.review.create({
      data: {
        comment: review.comment,
        isPurchased: review.isPurchased,
        rating: Number(review.rating),
        productId: review.productId,
        userFullName: review.userFullName,
        avatarUrl: review.avatarUrl,
      },
    });

    await this.increaseRating(review);

    const resultCalculated = await this.calculateTotalReview(review.productId)

    await this.prisma.product.update({
      where: {
        id: review.productId,
      },
      data: {
        totalReview: Number(resultCalculated._count._all),
        totalRating: Number(resultCalculated._avg.rating.toFixed(1)),
      },
    });
    return reviewCreated;
  }

  async autoGenerateRatingCount(productId: number) {
    return this.prisma.rating.createMany({
      data: [
        {
          name: '1 Star',
          productId: productId,
        },
        {
          name: '2 Star',
          productId: productId,
        },
        {
          name: '3 Star',
          productId: productId,
        },
        {
          name: '4 Star',
          productId: productId,
        },
        {
          name: '5 Star',
          productId: productId,
        },
      ],
    });
  }



  async increaseRating(review) {
    switch (Number(review.rating)) {
      case 1:
        return await this.prisma.rating.update({
          where: {
            name_productId: {
              name: '1 Star',
              productId: review.productId,
            },
          },
          data: {
            starCount: { increment: 1 },
          },
        });

      case 2:
        return await this.prisma.rating.update({
          where: {
            name_productId: {
              name: '2 Star',
              productId: review.productId,
            },
          },
          data: {
            starCount: { increment: 1 },
          },
        });

      case 3:
        return await this.prisma.rating.update({
          where: {
            name_productId: {
              name: '3 Star',
              productId: review.productId,
            },
          },
          data: {
            starCount: { increment: 1 },
          },
        });

      case 4:
        return await this.prisma.rating.update({
          where: {
            name_productId: {
              name: '4 Star',
              productId: review.productId,
            },
          },
          data: {
            starCount: { increment: 1 },
          },
        });

      case 5:
        return await this.prisma.rating.update({
          where: {
            name_productId: {
              name: '5 Star',
              productId: review.productId,
            },
          },
          data: {
            starCount: { increment: 1 },
          },
        });
    }
  }

  async calculateTotalReview(productId) {
    return await this.prisma.review.aggregate({
      where: {
        productId: productId
      },
      _count: {
        _all: true
      },
      _avg: {
        rating: true,
      }
    })
  }

  async deleteReview(productId: number) {
    return this.prisma.review.deleteMany({
      where: {
        productId: productId
      }
    })
  }

}
