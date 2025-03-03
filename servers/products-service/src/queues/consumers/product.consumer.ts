import { ExchangeNames, getErrorMessage, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@products/constants';
import { queueConnection } from '@products/queues/connection';
import { productService } from '@products/services/product.service';
import { log } from '@products/utils/logger.util';
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
        const { stores, count } = JSON.parse(msg!.content.toString());
        await productService.createSeeds(stores, count);
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeCreateProductSeeds() method:', getErrorMessage(error));
    }
  };
}

export const productConsumes = new ProductConsumes();
