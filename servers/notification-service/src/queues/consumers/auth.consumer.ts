import { ExchangeNames, getErrorMessage, IEmailLocals, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@notification/constants';
import { emailHelper } from '@notification/emails/email-helper';
import { queueConnection } from '@notification/queues/connection';
import { log } from '@notification/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

class AuthConsumes {
  public consumeSendAuthEmailMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.AUTH_NOTIFICATION_EMAIL, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.AUTH_NOTIFICATION_EMAIL, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.AUTH_NOTIFICATION_EMAIL, RoutingKeys.AUTH_NOTIFICATION_EMAIL);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        if (msg) {
          const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
          const locals: IEmailLocals = {
            username,
            verifyLink,
            resetLink
          };
          await emailHelper.sendEmail(template, receiverEmail, locals);
          channel.ack(msg!);
        } else {
          log.info(
            SERVICE_NAME +
              ` channel consumer en: ${ExchangeNames.AUTH_NOTIFICATION_EMAIL}, rk: ${RoutingKeys.AUTH_NOTIFICATION_EMAIL} is empty`
          );
        }
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', getErrorMessage(error));
    }
  };
}

export const authConsumes = new AuthConsumes();
