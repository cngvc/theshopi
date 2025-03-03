import { ExchangeNames, getErrorMessage, IBuyerDocument, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@users/constants';
import { queueConnection } from '@users/queues/connection';
import { usersProducer } from '@users/queues/users.producer';
import { buyerService } from '@users/services/buyer.service';
import { storeService } from '@users/services/store.service';
import { log } from '@users/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

class UsersConsumes {
  consumeUpdateUsersBuy = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.USERS_BUYER_UPDATE, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.USERS_BUYER_UPDATE, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.USERS_BUYER_UPDATE, RoutingKeys.USERS_BUYER_UPDATE);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const { type } = JSON.parse(msg!.content.toString());
        if (type === 'auth') {
          const { username, email, createdAt } = JSON.parse(msg!.content.toString());
          const buyer: IBuyerDocument = {
            username,
            email,
            purchasedProducts: [],
            createdAt
          };
          await buyerService.createBuyer(buyer);
        } else {
          // todo: order
        }
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeUpdateUsersBuy() method:', getErrorMessage(error));
    }
  };

  consumeUpdateUsersStore = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.USERS_STORE_UPDATE, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.USERS_STORE_UPDATE, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.USERS_STORE_UPDATE, RoutingKeys.USERS_STORE_UPDATE);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const { type, storeId, count } = JSON.parse(msg!.content.toString());
        if (type === 'create-order') {
        } else if (type === 'approve-order') {
        } else if (type === 'cancel-order') {
        } else if (type === 'update-store-product-count') {
          await storeService.updateTotalProductsCount(storeId, count);
        }
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeUpdateUsersStore() method:', getErrorMessage(error));
    }
  };

  consumeGetUsersStore = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.GET_STORE_USERS, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.GET_STORE_USERS, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.GET_STORE_USERS, RoutingKeys.GET_STORE_USERS);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const { count } = JSON.parse(msg!.content.toString());
        const stores = await storeService.getRandomStores(parseInt(count, 10));
        usersProducer.publishDirectMessage(
          channel,
          ExchangeNames.CREATE_SEED_PRODUCT,
          RoutingKeys.CREATE_SEED_PRODUCT,
          JSON.stringify({ stores, count }),
          'Message to callback product service creates seeds with store users.'
        );
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' consumeUpdateUsersStore() method:', getErrorMessage(error));
    }
  };
}

export const usersConsumes = new UsersConsumes();
