/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-cateogory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  createCatory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...dto,
      },
    });
  }

  async getAllCategories() {
    return await this.prisma.category.findMany({});
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...updateCategoryDto,
      },
    });
  }

  async deleteCategory(categoryId: number) {
    return this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
