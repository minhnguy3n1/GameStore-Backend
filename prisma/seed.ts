/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  rejectOnNotFound: true,
});
async function main() {
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.product.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.stockStatus.deleteMany();
  await prisma.code.deleteMany();
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
