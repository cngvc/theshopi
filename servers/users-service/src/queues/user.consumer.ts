import { ExchangeNames, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { IBuyerDocument } from '@cngvc/shopi-types';
import { faker } from '@faker-js/faker';
import { queueConnection } from '@user/queues/connection';
import { userProducer } from '@user/queues/user.producer';
import { buyerService } from '@user/services/buyer.service';
import { storeService } from '@user/services/store.service';
import { userService } from '@user/services/user.service';
import { captureError } from '@user/utils/logger.util';
import { Channel, ConsumeMessage } from 'amqplib';

class UserConsumes {
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
          const { username, email, createdAt, id } = JSON.parse(msg!.content.toString());
          const buyer: IBuyerDocument = {
            authId: id,
            username,
            email,
            purchasedProducts: [],
            createdAt,
            shippingAddress: {
              address: faker.location.streetAddress(), // remove in production
              city: faker.location.city(), // remove in production
              country: faker.location.country(), // remove in production
              postalCode: faker.location.zipCode() // remove in production
            }
          };
          await buyerService.createBuyer(buyer);
          console.log(`***Created buyer user: ${email}`);
        } else {
          // todo: order
        }
        channel.ack(msg!);
      });
    } catch (error) {
      captureError(error, 'consumeUpdateUsersBuy');
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
        const { type, storePublicId, count } = JSON.parse(msg!.content.toString());
        if (type === 'create-order') {
        } else if (type === 'approve-order') {
        } else if (type === 'cancel-order') {
        } else if (type === 'update-store-product-count') {
          await storeService.updateTotalProductsCount(storePublicId, count);
        }
        channel.ack(msg!);
      });
    } catch (error) {
      captureError(error, 'consumeUpdateUsersStore');
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
        userProducer.publishDirectMessage(
          channel,
          ExchangeNames.CREATE_SEED_PRODUCT,
          RoutingKeys.CREATE_SEED_PRODUCT,
          JSON.stringify({ stores })
        );
        channel.ack(msg!);
      });
    } catch (error) {
      captureError(error, 'consumeGetUsersStore');
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
        const { stores, buyers } = await userService.getRandomUsers(parseInt(count, 10));
        userProducer.publishDirectMessage(
          channel,
          ExchangeNames.CREATE_SEED_CHAT,
          RoutingKeys.CREATE_SEED_CHAT,
          JSON.stringify({ stores, buyers })
        );
        channel.ack(msg!);
      });
    } catch (error) {
      captureError(error, 'consumeGetUsers');
    }
  };
}

export const userConsumes = new UserConsumes();
