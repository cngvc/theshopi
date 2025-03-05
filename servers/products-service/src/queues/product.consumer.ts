import { ExchangeNames, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { queueConnection } from '@products/queues/connection';
import { productService } from '@products/services/product.service';
import { logCatch } from '@products/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

class ProductConsumes {
  consumeCreateProductSeeds = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.CREATE_SEED_PRODUCT, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.CREATE_SEED_PRODUCT, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.CREATE_SEED_PRODUCT, RoutingKeys.CREATE_SEED_PRODUCT);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const { stores } = JSON.parse(msg!.content.toString());
        await productService.createSeeds(stores);
        channel.ack(msg!);
      });
    } catch (error) {
      logCatch(error, 'consumeCreateProductSeeds');
    }
  };
}

export const productConsumes = new ProductConsumes();
