import { ExchangeNames, getErrorMessage, IBuyerDocument, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@users/constants';
import { queueConnection } from '@users/queues/connection';
import { buyerService } from '@users/services/buyer.service';
import { log } from '@users/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

class UsersConsumes {
  public consumeUpdateUsersBuy = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.USERS_BUYER_UPDATE, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.USERS_BUYER_UPDATE, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.USERS_BUYER_UPDATE, RoutingKeys.USERS_BUYER_UPDATE);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        if (msg) {
          const { type } = JSON.parse(msg.content.toString());
          if (type === 'auth') {
            const { username, email, profilePicture, createdAt } = JSON.parse(msg!.content.toString());
            const buyer: IBuyerDocument = {
              username,
              email,
              profilePicture,
              purchasedProducts: [],
              createdAt
            };
            await buyerService.createBuyer(buyer);
          } else {
            // todo: order
          }
        } else {
          log.info(
            SERVICE_NAME + ` channel consumer en: ${ExchangeNames.USERS_BUYER_UPDATE}, rk: ${RoutingKeys.USERS_BUYER_UPDATE} is empty`
          );
        }
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeAuthEmailMessages() method:', getErrorMessage(error));
    }
  };
}

export const usersConsumes = new UsersConsumes();
