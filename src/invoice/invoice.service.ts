/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

    async createInvoice(invoice) {

        const invoiceCreated = await this.prisma.invoice.create({
          data: {
              total: invoice.total,
            userId: invoice.userId,
            status: 'paid'
          },
        });

        await this.createInvoiceDetail(invoiceCreated.id, invoice.cart)
        
        return invoiceCreated
    }
    
    async createInvoiceDetail(invoiceId, products) {
        products.forEach(async (product) => {

            const getCodes = await this.prisma.code.findFirstOrThrow({
              where: {
                productId: product.id,
              },
            });

          const cdKeys = getCodes.code.slice(0,product.quantity);
          

            return await this.prisma.invoiceDetail.create({
              data: {
                invoiceId: invoiceId,
                productId: product.id,
                amount: product.quantity,
                price: product.price,
                code: cdKeys,
              },
            });
        });
    }
  
  async getListInvoicesForCustomer(userId) {
    return this.prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      include: {
        invoiceDetail: {
          select: {
            product: {
              select: {
                productName: true,
              },
            },
            invoiceId: true,
            amount: true,
            price: true,
            code: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
  async getListInvoiceForAdmin() {
    return this.prisma.invoice.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        invoiceDetail: {
          select: {
            product: {
              select: {
                productName: true,
              },
            },
            invoiceId: true,
            amount: true,
            price: true,
            code: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
