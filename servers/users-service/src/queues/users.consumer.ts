import { ExchangeNames, IBuyerDocument, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { queueConnection } from '@users/queues/connection';
import { usersProducer } from '@users/queues/users.producer';
import { buyerService } from '@users/services/buyer.service';
import { storeService } from '@users/services/store.service';
import { usersService } from '@users/services/users.service';
import { logCatch } from '@users/utils/logger.util';
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
          console.log(`***Created buyer user: ${email}`);
        } else {
          // todo: order
        }
        channel.ack(msg!);
      });
    } catch (error) {
      logCatch(error, 'consumeUpdateUsersBuy');
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
      logCatch(error, 'consumeUpdateUsersStore');
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
          JSON.stringify({ stores })
        );
        channel.ack(msg!);
      });
    } catch (error) {
      logCatch(error, 'consumeGetUsersStore');
    }
  };

  consumeGetUsers = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.GET_USERS, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.GET_USERS, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.GET_USERS, RoutingKeys.GET_USERS);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const { count } = JSON.parse(msg!.content.toString());
        const { stores, buyers } = await usersService.getRandomUsers(parseInt(count, 10));
        usersProducer.publishDirectMessage(
          channel,
          ExchangeNames.CREATE_SEED_CHAT,
          RoutingKeys.CREATE_SEED_CHAT,
          JSON.stringify({ stores, buyers })
        );
        channel.ack(msg!);
      });
    } catch (error) {
      logCatch(error, 'consumeGetUsers');
    }
  };
}

export const usersConsumes = new UsersConsumes();
