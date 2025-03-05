import { queueConnection } from '@chat/queues/connection';
import { logCatch } from '@chat/utils/logger.util';
import { Channel } from 'amqplib';

class ChatProducer {
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

export const chatProducer = new ChatProducer();
