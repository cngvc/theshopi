import 'express-async-errors';

import { AuthMiddleware, CustomError, IErrorResponse } from '@cngvc/shopi-shared';
import { ElasticsearchIndexes } from '@cngvc/shopi-types';
import { config } from '@user/config';
import { SERVER_PORT, SERVICE_NAME } from '@user/constants';
import { queueConnection } from '@user/queues/connection';
import { userConsumes } from '@user/queues/user.consumer';
import { appRoutes } from '@user/routes';
import { captureError, log } from '@user/utils/logger.util';
import { Channel } from 'amqplib';
import compression from 'compression';
import cors from 'cors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { elasticSearch } from './elasticsearch';
import { grpcUserServer } from './grpc/server/grpc.server';

export class Server {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  start = async (): Promise<void> => {
    this.standardMiddleware();
    this.securityMiddleware();
    this.routesMiddleware();
    await this.startQueues();
    await this.startElasticSearch();
    this.startRPCServer();
    this.errorHandler();
    this.startServer();
  };

  private securityMiddleware() {
    // only receive requests from gateway server
    this.app.use(AuthMiddleware.verifyGatewayRequest);

    this.app.set('trust proxy', 1);
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: config.API_GATEWAY_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(): void {
    this.app.use(compression());
    this.app.use(json({ limit: '5mb' }));
    this.app.use(urlencoded({ extended: true, limit: '5mb' }));
  }

  private routesMiddleware() {
    appRoutes(this.app);
  }

  private async startElasticSearch() {
    await elasticSearch.checkConnection();
    await elasticSearch.createIndex(ElasticsearchIndexes.auth);
    await elasticSearch.createIndex(ElasticsearchIndexes.stores);
  }

  private async startQueues() {
    const channel = (await queueConnection.createConnection()) as Channel;
    await userConsumes.consumeUpdateUsersBuy(channel);
    await userConsumes.consumeUpdateUsersStore(channel);
    await userConsumes.consumeGetUsersStore(channel);
    await userConsumes.consumeGetUsers(channel);
  }

  private startRPCServer() {
    grpcUserServer.start(Number(`${SERVER_PORT}0`));
  }

  private errorHandler(): void {
    this.app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.log('error', SERVICE_NAME + ` ${error.comingFrom}: ${error.message}`);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeError());
        return;
      }
      res.status(error.statusCode).json({
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        comingFrom: error.comingFrom
      });
    });
  }

  private async startServer(): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      this.startHttpServer(httpServer);
      log.info(SERVICE_NAME + ` has started with process id ${process.pid}`);
    } catch (error) {
      captureError(error, 'startServer');
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      httpServer.listen(SERVER_PORT, () => {
        log.info(SERVICE_NAME + ` has started on port ${SERVER_PORT}`);
      });
    } catch (error) {
      captureError(error, 'startHttpServer');
    }
  }
}
