import { config } from '@products/config';
import { SERVICE_NAME } from '@products/constants';
import { log, logCatch } from '@products/utils/logger.util';
import client, { Channel, ChannelModel } from 'amqplib';

class QueueConnection {
  createConnection = async (): Promise<Channel | undefined> => {
    try {
      const connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`, { clientProperties: { connection_name: SERVICE_NAME } });
      const channel: Channel = await connection.createChannel();
      log.info(SERVICE_NAME + ` connected to queue successfully`);
      this.closeConnection(channel, connection);
      return channel;
    } catch (error) {
      logCatch(error, 'createConnection');
      return undefined;
    }
  };

  private closeConnection = async (channel: Channel, connection: ChannelModel) => {
    process.once('SIGNINT', async () => {
      await channel.close();
      await connection.close();
    });
  };
}

export const queueConnection = new QueueConnection();
