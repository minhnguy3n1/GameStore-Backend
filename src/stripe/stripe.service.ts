/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Cart } from './cart.interface';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  checkout(cart: Cart) {
    const totalPrice = cart.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    return this.stripe.paymentIntents.create({
      amount: totalPrice * 100, //cents
      currency: 'usd', //set currency
      payment_method_types: ['card'],
    });
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  public async charge(
    amount: number,
    stripeCustomerId: string,
    paymentMethodId: string,
  ) {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100,
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      off_session: true,
      confirm: true,
    });
  }

  public async attachCreditCard(
    stripeCustomerId: string,
    paymentMethodId: string,
  ) {
    return await this.stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
    });
  }

  public async listCreditCards(customerId: string) {
    return this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }
}
