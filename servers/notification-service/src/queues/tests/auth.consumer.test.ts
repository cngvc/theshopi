import { ExchangeNames, QueueNames, RoutingKeys } from '@cngvc/shopi-shared';
import { authConsumes } from '@notification/queues/auth.consumer';
import { queueConnection } from '@notification/queues/connection';
import amqp from 'amqplib';

jest.mock('@notification/queues/connection');
jest.mock('amqplib');
jest.mock('@cngvc/shopi-shared');
jest.mock('@notification/utils/logger.util', () => ({
  createLogger: jest.fn(() => ({
    log: jest.fn(),
    captureError: jest.fn()
  }))
}));

describe('Auth Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authConsumes.consumeSendAuthEmailMessages', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: QueueNames.AUTH_NOTIFICATION_EMAIL, messageCount: 0, consumerCount: 0 });
      jest.spyOn(queueConnection, 'createConnection').mockReturnValue(channel as never);

      const connectionChannel: amqp.Channel | undefined = await queueConnection.createConnection();
      await authConsumes.consumeSendAuthEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(ExchangeNames.AUTH_NOTIFICATION_EMAIL, 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(
        QueueNames.AUTH_NOTIFICATION_EMAIL,
        ExchangeNames.AUTH_NOTIFICATION_EMAIL,
        RoutingKeys.AUTH_NOTIFICATION_EMAIL
      );
    });
  });
});
