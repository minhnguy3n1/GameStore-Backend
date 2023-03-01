/* eslint-disable prettier/prettier */
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { EmailverifyModule } from './emailverify/emailverify.module';
import { ProductModule } from './product/product.module';
import { PublisherModule } from './publisher/publisher.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport:
        'smtps://minhnngcd191326@fpt.edu.vn:kbgbahsswqbttznd@smtp.gmail.com',
      defaults: {
        from: '"nest-modules" <minhnngcd1913266@fpt.edu.vn>',
      },
      template: {
        dir: __dirname + '/templates/email',
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
  ],
})
export class AppModule {}
