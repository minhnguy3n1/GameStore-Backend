/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { Cart } from './cart.interface';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post()
  checkout(@Body() body: { cart: Cart }) {
    try {
      return this.stripeService.checkout(body.cart);
    } catch (error) {
      return error;
    }
  }

  @Post('create-customer')
  createStripeCustomer(@Body() body) {
    return this.stripeService.createCustomer(body.name, body.email);
  }
}
