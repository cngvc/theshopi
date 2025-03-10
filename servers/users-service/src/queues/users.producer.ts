import { queueConnection } from '@users/queues/connection';
import { captureError } from '@users/utils/logger.util';
import { Channel } from 'amqplib';

class UsersProducer {
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

export const usersProducer = new UsersProducer();
