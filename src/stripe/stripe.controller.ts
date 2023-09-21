/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuardApi } from '../auth/guards/jwt-auth.guard';
import { Cart } from './cart.interface';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}


  @Post('create-customer')
  createStripeCustomer(@Body() body) {
    return this.stripeService.createCustomer(body.name, body.email);
  }

  @UseGuards(JwtAuthGuardApi)
  @Post('charge')
  charge(@Body() body) {
    return this.stripeService.charge(
      body.total,
      body.stripeCustomerId,
      body.paymentMethodId,
    );
  }

  @UseGuards(JwtAuthGuardApi)
  @Post('attach-card')
  attachCreditCard(@Body() body) {
    return this.stripeService.attachCreditCard(
      body.stripeCustomerId,
      body.paymentMethodId,
    );
  }

  @Post('list-cards')
  listCreditCard(@Body() body) {
    return this.stripeService.listCreditCards(body.stripeCustomerId);
  }
}
