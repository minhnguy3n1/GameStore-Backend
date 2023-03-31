/* eslint-disable prettier/prettier */
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { EmailverifyModule } from './emailverify/emailverify.module';
import { ProductOptionModule } from './product-option/product-option.module';
import { ProductStatusModule } from './product-status/product-status.module';
import { ProductModule } from './product/product.module';
import { PublisherModule } from './publisher/publisher.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: `smtp://${process.env.EMAIL}:${process.env.EMAIL_PASS}@${process.env.EMAIL_DOMAIN}`,
      defaults: {
        from: '"nest-modules" <justen7@ethereal.email>',
      },
      template: {
        dir: process.cwd() + '/src/templates/email/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    EmailverifyModule,
    ProductModule,
    CategoryModule,
    PublisherModule,
    ProductOptionModule,
    ProductStatusModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
