import { getErrorMessage } from '@cngvc/shopi-shared';
import { config } from '@users/config';
import { SERVICE_NAME } from '@users/constants';
import { log } from '@users/utils/logger.util';
import client, { Channel, Connection } from 'amqplib';

class QueueConnection {
  createConnection = async (): Promise<Channel | undefined> => {
    try {
      const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
      const channel: Channel = await connection.createChannel();
      log.info(SERVICE_NAME + ` connected to queue successfully`);
      this.closeConnection(channel, connection);
      return channel;
    } catch (error) {
      log.log('error', SERVICE_NAME + ' createConnection() method:', getErrorMessage(error));
      return undefined;
    }
  };

  private closeConnection = async (channel: Channel, connection: Connection) => {
    process.once('SIGNINT', async () => {
      await channel.close();
      await connection.close();
    });
  };
}

export const queueConnection = new QueueConnection();
