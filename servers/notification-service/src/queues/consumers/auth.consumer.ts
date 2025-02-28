import { ExchangeNames, getErrorMessage, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@notification/constants';
import { createConnection } from '@notification/queues/connections';
import { log } from '@notification/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

class AuthConsumes {
  public consumeAuthUserCreatedMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.USER_CREATED, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.USER_CREATED, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.USER_CREATED, RoutingKeys.USER_CREATED);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        if (msg) {
          const { username, email } = JSON.parse(msg.content.toString());
          console.log(`User ${username} has been created ${new Date()}`);
          // todo: send email here
          channel.ack(msg);
        } else {
          log.info(SERVICE_NAME + ` channel consumer en: ${ExchangeNames.USER_CREATED}, rk: ${RoutingKeys.USER_CREATED} is empty`);
        }
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', getErrorMessage(error));
    }
  };
}

export const authConsumes = new AuthConsumes();
