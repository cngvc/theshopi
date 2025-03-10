import { config } from '@order/config';
import { SERVICE_NAME } from '@order/constants';
import { captureError, log } from '@order/utils/logger.util';
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
      captureError(error, 'createConnection');
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
