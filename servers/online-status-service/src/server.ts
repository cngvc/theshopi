import { SERVER_PORT, SERVICE_NAME } from '@online-status/constants';
import { elasticSearch } from '@online-status/elasticsearch';
import { queueConnection } from '@online-status/queues/connection';
import { appRoutes } from '@online-status/routes';
import { SocketHandler } from '@online-status/sockets/socket.handler';
import { log, logCatch } from '@online-status/utils/logger.util';
import { Channel } from 'amqplib';
import { Application } from 'express';
import http from 'http';

export class OnlineStatusServer {
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
      const socketHandler = new SocketHandler(httpServer);
      socketHandler.createSocket();
      log.info(`Worker with process id of ${process.pid} on online-status service has started`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(SERVICE_NAME + ` running on port ${SERVER_PORT}`);
      });
      socketHandler.listen();
    } catch (error) {
      logCatch(error, 'startServer');
    }
  }
}
