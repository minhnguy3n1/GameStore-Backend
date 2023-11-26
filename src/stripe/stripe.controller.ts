/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  // @UseGuards(JwtAuthGuardApi)
  @Post('charge')
  async charge(@Body() body) {
    return await this.stripeService.charge(
      body.total,
      body.stripeCustomerId,
      body.paymentMethodId,
    );
  }
}
