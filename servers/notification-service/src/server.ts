import 'express-async-errors';

import { SERVER_PORT, SERVICE_NAME } from '@notification/constants';
import { elasticSearch } from '@notification/elasticsearch';
import { queueConnection } from '@notification/queues/connection';
import { authConsumes } from '@notification/queues/consumers/auth.consumer';
import { appRoutes } from '@notification/routes';
import { log, logCatch } from '@notification/utils/logger.util';
import { Channel } from 'amqplib';
import { Application } from 'express';
import http from 'http';

export class NotificationServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  start = (): void => {
    this.startServer();
    this.routesMiddleware();
    this.startQueues();
    this.startElasticSearch();
  };

  private async startQueues() {
    const channel = (await queueConnection.createConnection()) as Channel;
    await authConsumes.consumeSendAuthEmailMessages(channel);
  }

  private routesMiddleware() {
    appRoutes(this.app);
  }

  private startElasticSearch() {
    elasticSearch.checkConnection();
  }

  private startServer() {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      log.info(`Worker with process id of ${process.pid} on notification service has started`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(SERVICE_NAME + ` running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      logCatch(error, 'startServer');
    }
  }
}
