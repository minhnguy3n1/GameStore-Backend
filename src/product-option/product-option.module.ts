/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ProductOptionController } from './product-option.controller';

@Module({
  controllers: [ProductOptionController],
})
export class ProductOptionModule {}
