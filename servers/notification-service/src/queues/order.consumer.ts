import { ExchangeNames, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { IEmailLocals } from '@cngvc/shopi-types';
import { SERVICE_NAME } from '@notification/constants';
import { emailHelper } from '@notification/email-helper';
import { queueConnection } from '@notification/queues/connection';
import { captureError, log } from '@notification/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

class OrderConsumes {
  public consumeSendOrderEmailMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.CREATE_ORDER_EMAIL, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.CREATE_ORDER_EMAIL, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.CREATE_ORDER_EMAIL, RoutingKeys.CREATE_ORDER_EMAIL);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        if (msg) {
          const {
            username,
            receiverEmail,
            orderPublicId,
            totalAmount,
            shippingAddress,
            shippingCity,
            shippingCountry,
            orderLink,
            template
          } = JSON.parse(msg.content.toString());
          const locals: IEmailLocals = {
            username,
            orderPublicId,
            totalAmount,
            shippingAddress,
            shippingCity,
            shippingCountry,
            orderLink
          };
          await emailHelper.sendEmail(template, receiverEmail, locals);
          channel.ack(msg!);
        } else {
          log.info(
            SERVICE_NAME + ` channel consumer en: ${ExchangeNames.CREATE_ORDER_EMAIL}, rk: ${RoutingKeys.CREATE_ORDER_EMAIL} is empty`
          );
        }
      });
    } catch (error) {
      captureError(error, 'consumeAuthEmailMessages');
    }
  };
}

export const orderConsumes = new OrderConsumes();
