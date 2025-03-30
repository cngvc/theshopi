import { balanceService } from '@balance/services/balance.service';
import { captureError } from '@balance/utils/logger.util';
import { ExchangeNames, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { queueConnection } from './connection';

class BalanceConsumes {
  consumeCreateBalanceSeeds = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.CREATE_SEED_BALANCE, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.CREATE_SEED_BALANCE, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.CREATE_SEED_BALANCE, RoutingKeys.CREATE_SEED_BALANCE);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const { buyers } = JSON.parse(msg!.content.toString());
        await balanceService.createSeeds(buyers);
        channel.ack(msg!);
      });
    } catch (error) {
      captureError(error, 'consumeCreateChatSeeds');
    }
  };
}

export const balanceConsumes = new BalanceConsumes();
