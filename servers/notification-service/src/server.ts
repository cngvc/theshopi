import 'express-async-errors';

import { SERVER_PORT, SERVICE_NAME } from '@notification/constants';
import { elasticSearch } from '@notification/elasticsearch';
import { queueConnection } from '@notification/queues/connection';
import { appRoutes } from '@notification/routes';
import { captureError, log } from '@notification/utils/logger.util';
import { Channel } from 'amqplib';
import { Application } from 'express';
import http from 'http';
import { authConsumes } from './queues/auth.consumer';
import { orderConsumes } from './queues/order.consumer';

export class Server {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  start = async (): Promise<void> => {
    this.startServer();
    this.routesMiddleware();
    await this.startQueues();
    await this.startElasticSearch();
  };

  private async startQueues() {
    const channel = (await queueConnection.createConnection()) as Channel;
    await authConsumes.consumeSendAuthEmailMessages(channel);
    await orderConsumes.consumeSendOrderEmailMessages(channel);
  }

  private routesMiddleware() {
    appRoutes(this.app);
  }

  private async startElasticSearch() {
    await elasticSearch.checkConnection();
  }

  private startServer() {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      log.info(`Worker with process id of ${process.pid} on notification service has started`);
      httpServer.listen(SERVER_PORT, '0.0.0.0', () => {
        log.info(SERVICE_NAME + ` running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      captureError(error, 'startServer');
    }
  }
}
