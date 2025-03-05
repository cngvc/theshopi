import 'express-async-errors';

import { CustomError, IAuthPayload, IErrorResponse } from '@cngvc/shopi-shared';
import { config } from '@products/config';
import { SERVER_PORT, SERVICE_NAME } from '@products/constants';
import { elasticSearchIndexes } from '@products/constants/elasticsearch-indexes';
import { elasticSearch } from '@products/elasticsearch';
import { queueConnection } from '@products/queues/connection';
import { productConsumes } from '@products/queues/consumers/product.consumer';
import { appRoutes } from '@products/routes';
import { log, logCatch } from '@products/utils/logger.util';
import { Channel } from 'amqplib';
import compression from 'compression';
import cors from 'cors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { verify } from 'jsonwebtoken';

export let productChannel: Channel;

export class ProductServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  start = (): void => {
    this.standardMiddleware();
    this.securityMiddleware();
    this.routesMiddleware();
    this.startQueues();
    this.startElasticSearch();
    this.errorHandler();
    this.startServer();
  };

  private securityMiddleware() {
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
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.headers.authorization) {
        const token = (req.headers.authorization as string).split(' ')[1];
        const payload = verify(token, `${config.AUTH_JWT_TOKEN_SECRET}`) as IAuthPayload;
        req.currentUser = payload;
      }
      next();
    });
  }

  private standardMiddleware(): void {
    this.app.use(compression());
    this.app.use(json({ limit: '5mb' }));
    this.app.use(urlencoded({ extended: true, limit: '5mb' }));
  }

  private routesMiddleware() {
    appRoutes(this.app);
  }

  private async startQueues() {
    productChannel = (await queueConnection.createConnection()) as Channel;
    productConsumes.consumeCreateProductSeeds(productChannel);
  }

  private startElasticSearch() {
    elasticSearch.checkConnection();
    elasticSearch.createIndex(elasticSearchIndexes.products);
  }

  private errorHandler(): void {
    this.app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.log('error', SERVICE_NAME + ` ${error.comingFrom}: ${error.message}`);
      if (error instanceof CustomError) {
        console.log(error.serializeError());
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
