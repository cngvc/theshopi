import { ExchangeNames, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { captureError } from '@payment/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';
import { queueConnection } from './connection';

class PaymentConsumes {
  consumeDeleteCart = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.DELETE_COMPLETED_CART, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.DELETE_COMPLETED_CART, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.DELETE_COMPLETED_CART, RoutingKeys.DELETE_COMPLETED_CART);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const {} = JSON.parse(msg!.content.toString());
        channel.ack(msg!);
      });
    } catch (error) {
      captureError(error, 'consumeDeleteCart');
    }
  };
}

export const paymentConsumes = new PaymentConsumes();
