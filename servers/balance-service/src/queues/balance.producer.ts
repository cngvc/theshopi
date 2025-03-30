import { captureError } from '@balance/utils/logger.util';
import { Channel } from 'amqplib';
import { queueConnection } from './connection';

class BalanceProducer {
  public publishDirectMessage = async (channel: Channel, exchangeName: string, routingKey: string, message: string): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(exchangeName, 'direct');
      channel.publish(exchangeName, routingKey, Buffer.from(message));
    } catch (error) {
      captureError(error, 'publishDirectMessage');
    }
  };
}

export const balanceProducer = new BalanceProducer();
