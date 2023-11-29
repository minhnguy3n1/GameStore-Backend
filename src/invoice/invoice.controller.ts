/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private invoiceService: InvoiceService){}

    @Post('create')
    async createInvoice(@Body() body) {
        return this.invoiceService.createInvoice(body);
    }

    @Get('/user/:id')
    async getInvoicesForCustomer(@Param('id', ParseIntPipe) userId) {
        return this.invoiceService.getListInvoicesForCustomer(userId)
    }

    @Get('invoices')
    async getInvoicesForAdmin() {
        return this.invoiceService.getListInvoiceForAdmin()
    }
}
