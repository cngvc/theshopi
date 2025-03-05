import { queueConnection } from '@products/queues/connection';
import { logCatch } from '@products/utils/logger.util';
import { Channel } from 'amqplib';

class ProductProducer {
  public publishDirectMessage = async (channel: Channel, exchangeName: string, routingKey: string, message: string): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(exchangeName, 'direct');
      channel.publish(exchangeName, routingKey, Buffer.from(message));
    } catch (error) {
      logCatch(error, 'publishDirectMessage');
    }
  };
}

export const productProducer = new ProductProducer();
