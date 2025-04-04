import { SERVER_PORT, SERVICE_NAME } from '@socket/constants';
import { elasticSearch } from '@socket/elasticsearch';
import { appRoutes } from '@socket/routes';
import { SocketHandler } from '@socket/sockets/socket.handler';
import { captureError, log } from '@socket/utils/logger.util';
import { Application } from 'express';
import http from 'http';

export class SocketServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  start = async (): Promise<void> => {
    this.startServer();
    this.routesMiddleware();
    await this.startElasticSearch();
  };

  private routesMiddleware() {
    appRoutes(this.app);
  }

  private async startElasticSearch() {
    await elasticSearch.checkConnection();
  }

  private startServer() {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      const socketHandler = new SocketHandler(httpServer);
      this.startHttpServer(httpServer);
      socketHandler.listen();
      log.info(`Worker with process id of ${process.pid} on socket service has started`);
    } catch (error) {
      captureError(error, 'startServer');
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      httpServer.listen(SERVER_PORT, '0.0.0.0', () => {
        log.info(SERVICE_NAME + ` has started on port ${SERVER_PORT}`);
      });
    } catch (error) {
      captureError(error, 'startHttpServer');
    }
  }
}
