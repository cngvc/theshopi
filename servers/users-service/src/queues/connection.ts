import { config } from '@users/config';
import { SERVICE_NAME } from '@users/constants';
import { log, logCatch } from '@users/utils/logger.util';
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
