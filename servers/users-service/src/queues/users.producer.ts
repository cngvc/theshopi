import { getErrorMessage } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@users/constants';
import { log } from '@users/utils/logger.util';
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
      log.log('error', SERVICE_NAME + ' publishDirectMessage() method:', getErrorMessage(error));
    }
  };
}

export const usersProducer = new UsersProducer();
