import 'express-async-errors';

import { CustomError, IErrorResponse } from '@cngvc/shopi-shared';

import { config } from '@gateway/config';
import { DEFAULT_DEVICE, DEFAULT_ERROR_CODE, SERVER_PORT, SERVICE_NAME } from '@gateway/constants';
import { elasticSearch } from '@gateway/elasticsearch';
import { endpointMiddleware } from '@gateway/middlewares/endpoint.middleware';
import { appRoutes } from '@gateway/routes';
import { authService } from '@gateway/services/api/auth.service';
import { buyerService } from '@gateway/services/api/buyer.service';
import { cartService } from '@gateway/services/api/cart.service';
import { chatService } from '@gateway/services/api/chat.service';
import { orderService } from '@gateway/services/api/order.service';
import { productService } from '@gateway/services/api/product.service';
import { storeService } from '@gateway/services/api/store.service';
import { captureError, log } from '@gateway/utils/logger.util';
import { isAxiosError } from 'axios';
import compression from 'compression';
import cors from 'cors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { StatusCodes } from 'http-status-codes';
import { authMiddleware } from './middlewares/auth.middleware';
import { rateLimitMiddleware } from './middlewares/redis-rate-limit.middleware';
import { userAgentMiddleware } from './middlewares/user-agent.middleware';
import { balanceService } from './services/api/balance.service';

export class GatewayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware();
    this.standardMiddleware();
    this.routesMiddleware();
    this.startElasticSearch();
    this.forwardSocket();
    this.errorHandler();
    this.startServer();
  }

  private securityMiddleware(): void {
    this.app.set('trust proxy', 1);
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
    this.app.use(rateLimitMiddleware.redisRateLimit);
    this.app.use(authMiddleware.attachUser);
    this.app.use(userAgentMiddleware.attachUseragent);

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const headerXUser = req.headers['x-user'] as string | undefined;
      const services = [authService, buyerService, storeService, productService, chatService, cartService, orderService, balanceService];
      if (headerXUser) {
        services.map((e) => e.setXUserHeader(headerXUser));
      }
      const headerXUserDeviceFP = (req.headers['x-device-fingerprint'] as string) || DEFAULT_DEVICE;
      if (headerXUserDeviceFP) {
        authService.setXUserDeviceFPHeader(headerXUserDeviceFP);
      }
      next();
    });

    this.app.use(endpointMiddleware.gatewayRequestLogger);
  }

  private startElasticSearch(): void {
    elasticSearch.checkConnection();
  }

  private standardMiddleware(): void {
    this.app.use(compression());
    this.app.use(json({ limit: '5mb' }));
    this.app.use(urlencoded({ extended: true, limit: '5mb' }));
  }

  private routesMiddleware(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send({ message: 'Theshopi microservice-based project, it was developed by Joe as a portfolio project!' });
    });

    appRoutes(this.app);
  }

  private forwardSocket(): void {
    this.app.use('/socket.io', createProxyMiddleware({ target: config.SOCKET_BASE_URL, ws: true }));
  }

  private errorHandler(): void {
    this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `${fullUrl} endpoint does not exist.`, '');
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'The endpoint called does not exist',
        statusCode: StatusCodes.NOT_FOUND,
        status: 'error',
        comingFrom: 'Server error handler middleware'
      });
      return;
    });

    this.app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) {
        log.log('error', SERVICE_NAME + ` ${error.comingFrom}`, error.message);
        res.status(error.statusCode).json(error.serializeError());
        return;
      }
      if (isAxiosError(error)) {
        const status = error?.response?.data?.status || 'error';
        const message = error?.response?.data?.message ?? 'Error occurred.';
        const statusCode = error?.response?.data?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const comingFrom = error?.response?.data?.comingFrom ?? 'Axios middleware.';

        log.log('error', SERVICE_NAME + ` ${comingFrom}`, message);

        res.status(statusCode).json({
          message,
          statusCode,
          status,
          comingFrom
        });
        return;
      }
      const message = error.message || 'Internal Server Error';
      log.log('error', SERVICE_NAME + ` Unknown error.`, message);
      res.status(DEFAULT_ERROR_CODE).json({
        message,
        statusCode: DEFAULT_ERROR_CODE,
        status: 'error',
        comingFrom: 'Unknown error.'
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
      httpServer.listen(SERVER_PORT, '0.0.0.0', () => {
        log.info(SERVICE_NAME + ` has started on port ${SERVER_PORT}`);
      });
    } catch (error) {
      captureError(error, 'startHttpServer');
    }
  }
}
