import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.createCategory(dto);
  }

  @Post("add-many")
   async createManyCategories(@Body() categories) {
    return await this.categoryService.createManyCategories(categories);
  }

  @Put(':id')
  updateCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(categoryId, dto);
  }

  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.deleteCategory(categoryId);
  }

  @Delete()
  async deleteAllCategories() {
    return await this.categoryService.deleteAllCategories()
  }
}
