import { SERVER_PORT, SERVICE_NAME } from '@online-status/constants';
import { elasticSearch } from '@online-status/elasticsearch';
import { appRoutes } from '@online-status/routes';
import { SocketHandler } from '@online-status/sockets/socket.handler';
import { log, logCatch } from '@online-status/utils/logger.util';
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
    this.startElasticSearch();
  };

  private routesMiddleware() {
    appRoutes(this.app);
  }

  private startElasticSearch() {
    elasticSearch.client.checkConnection();
  }

  private startServer() {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      const socketHandler = new SocketHandler(httpServer);
      socketHandler.createSocket();
      this.startHttpServer(httpServer);
      socketHandler.listen();
      log.info(`Worker with process id of ${process.pid} on online-status service has started`);
    } catch (error) {
      logCatch(error, 'startServer');
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      httpServer.listen(SERVER_PORT, () => {
        log.info(SERVICE_NAME + ` has started on port ${SERVER_PORT}`);
      });
    } catch (error) {
      logCatch(error, 'startHttpServer');
    }
  }
}
