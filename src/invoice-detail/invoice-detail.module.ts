import { Module } from '@nestjs/common';
import { InvoiceDetailController } from './invoice-detail.controller';
import { InvoiceDetailService } from './invoice-detail.service';

@Module({
  controllers: [InvoiceDetailController],
  providers: [InvoiceDetailService]
})
export class InvoiceDetailModule {}
