/* eslint-disable prettier/prettier */
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const emailConfig = {
  transport: `smtp://${process.env.EMAIL}:${process.env.EMAIL_PASS}@${process.env.EMAIL_DOMAIN}`,
  defaults: {
    from: `"nest-modules" < ${process.env.EMAIL}>`,
  },
  template: {
    dir: process.cwd() + '/src/templates/email/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
