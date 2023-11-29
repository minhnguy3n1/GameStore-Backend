/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CDKeyService {
    constructor(private prisma: PrismaService) { }

    async getCdkey(productId) {
        return this.prisma.code.findUnique({
          where: {
            productId: productId,
          },
        });
    }
    
    async createCDKey(productId) {
        const newCdkey = await this.prisma.code.create({
          data: {
            productId,
          },
        });
    

        await this.prisma.product.update({
            where: { 
                id: newCdkey.productId,
            },
            data: 
            {
              available: newCdkey.code.length,
              // id 2 - out_of_stock
              stockId: 2,
            }
        })
        return newCdkey
    }

  async updateCDKey(cdkey) {
      
         const newCdkey = await this.prisma.code.update({
          where: {
            productId: cdkey.productId,
          },
          data: {
            code: {
              push: cdkey.code,
            },
          },
         });
    
    await this.updateAmountProduct(newCdkey.productId)
    return newCdkey;
    }

    async updateAmountProduct(productId) {
        const cdkey = await this.prisma.code.findUnique({
            where: {
                productId: Number(productId),
            }
        })
      
      
      // id 1 - in_stock
      let stockId = 1;
      if (cdkey.code.length = 0) {
        // id 2 - out_of_stock
        stockId = 2;
      }

        return await this.prisma.product.update({
          where: {
            id: cdkey.productId,
          },
          data: {
            available: cdkey.code.length,
            stockId: stockId,
          },
        });
    }

    deleteCdkey(id) {
        return this.prisma.code.delete({
            where: {
                productId: id,
            }
        })
    }
}
