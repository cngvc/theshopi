import { ServerError } from '@cngvc/shopi-shared';
import { PaymentMethod } from '@cngvc/shopi-types';
import { config } from '@payment/config';
import { PaymentModel } from '@payment/models/payment.schema';
import Stripe from 'stripe';

const stripe: Stripe = new Stripe(config.STRIPE_API_KEY!, {
  typescript: true
});

class PaymentService {
  async createPayment(payload: {
    orderPublicId: string;
    email: string;
    method: PaymentMethod;
    totalAmount: number;
    currency: string;
  }): Promise<{
    paymentPublicId: string;
    clientSecret?: string;
    status: string;
  }> {
    const payment = await PaymentModel.create({
      orderPublicId: payload.orderPublicId,
      method: payload.method,
      totalAmount: payload.totalAmount,
      currency: payload.currency
    });

    if (payload.method === PaymentMethod.stripe) {
      const customer: Stripe.Response<Stripe.ApiSearchResult<Stripe.Customer>> = await stripe.customers.search({
        query: `email:"${payload.email}"`
      });
      let customerId = '';
      if (customer.data.length === 0) {
        const createdCustomer: Stripe.Response<Stripe.Customer> = await stripe.customers.create({
          email: `${payload.email}`,
          metadata: {
            orderPublicId: payload.orderPublicId
          }
        });
        customerId = createdCustomer.id;
      } else {
        customerId = customer.data[0].id;
      }
      if (!customerId) {
        throw new ServerError('Cannot create customer', 'createPayment');
      }
      const serviceFee: number = 0;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.floor((payload.totalAmount + serviceFee) * 100),
        currency: 'usd',
        customer: customerId,
        automatic_payment_methods: { enabled: true }
      });
      if (!paymentIntent) {
        throw new ServerError('Cannot create payment intent', 'createPayment');
      }
      payment.paymentIntentId = paymentIntent.id;
      await payment.save();
      return { paymentPublicId: payment.paymentPublicId!, clientSecret: paymentIntent.client_secret!, status: payment.status! };
    }

    return { paymentPublicId: payment.paymentPublicId!, status: payment.status! };
  }
}

export const paymentService = new PaymentService();
