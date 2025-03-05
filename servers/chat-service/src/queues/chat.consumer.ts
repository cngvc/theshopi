import { queueConnection } from '@chat/queues/connection';
import { chatService } from '@chat/services/chat.service';
import { logCatch } from '@chat/utils/logger.util';
import { ExchangeNames, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { Channel, ConsumeMessage } from 'amqplib';

class ChatConsumes {
  consumeCreateChatSeeds = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await queueConnection.createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.CREATE_SEED_CHAT, 'direct');
      const assertQueue = await channel.assertQueue(QueueNames.CREATE_SEED_CHAT, { durable: true, autoDelete: false });
      await channel.bindQueue(assertQueue.queue, ExchangeNames.CREATE_SEED_CHAT, RoutingKeys.CREATE_SEED_CHAT);
      channel.consume(assertQueue.queue, async (msg: ConsumeMessage | null) => {
        const { stores, buyers } = JSON.parse(msg!.content.toString());
        await chatService.createSeeds(stores, buyers);
        channel.ack(msg!);
      });
    } catch (error) {
      logCatch(error, 'consumeCreateChatSeeds');
    }
  };
}

export const chatConsumes = new ChatConsumes();
