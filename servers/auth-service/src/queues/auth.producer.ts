import { SERVICE_NAME } from '@auth/constants';
import { log } from '@auth/utils/logger.util';
import { getErrorMessage } from '@cngvc/shopi-shared';
import { Channel } from 'amqplib';
import { createConnection } from './connection';

class AuthProducer {
  public publishDirectMessage = async (
    channel: Channel,
    exchangeName: string,
    routingKey: string,
    message: string,
    logMessage: string
  ): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(exchangeName, 'direct');
      channel.publish(exchangeName, routingKey, Buffer.from(message));
      log.info(logMessage);
    } catch (error) {
      log.log('error', SERVICE_NAME + ' publishDirectMessage() method:', getErrorMessage(error));
    }
  };
}

export const authProducer = new AuthProducer();
