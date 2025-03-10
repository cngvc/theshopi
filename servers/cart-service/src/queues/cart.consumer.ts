import { cartService } from '@cart/services/cart.service';
import { captureError } from '@cart/utils/logger.util';
import { ExchangeNames, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { queueConnection } from './connection';

class CartConsumes {
  consumeDeleteCart = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.DELETE_COMPLETED_CART, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.DELETE_COMPLETED_CART, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.DELETE_COMPLETED_CART, RoutingKeys.DELETE_COMPLETED_CART);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const { authId } = JSON.parse(msg!.content.toString());
        await cartService.deleteCart(authId);
        channel.ack(msg!);
      });
    } catch (error) {
      captureError(error, 'consumeDeleteCart');
    }
  };
}

export const cartConsumes = new CartConsumes();
