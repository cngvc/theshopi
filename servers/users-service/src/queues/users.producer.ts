import { log, logCatch } from '@users/utils/logger.util';
import { Channel } from 'amqplib';
import { queueConnection } from './connection';

class UsersProducer {
  public publishDirectMessage = async (
    channel: Channel,
    exchangeName: string,
    routingKey: string,
    message: string,
    logMessage: string
  ): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(exchangeName, 'direct');
      channel.publish(exchangeName, routingKey, Buffer.from(message));
      log.info(logMessage);
    } catch (error) {
      logCatch(error, 'publishDirectMessage');
    }
  };
}

export const usersProducer = new UsersProducer();
