import 'express-async-errors';

import { CustomError, getErrorMessage, IErrorResponse } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { DEFAULT_ERROR_CODE, SERVER_PORT, SERVICE_NAME } from '@gateway/constants';
import { appRoutes } from '@gateway/routes';
import { authService } from '@gateway/services/api/auth.service';
import { isAxiosError } from 'axios';
import compression from 'compression';
import cors from 'cors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { StatusCodes } from 'http-status-codes';
import { elasticSearch } from './elasticsearch';
import { endpointMiddleware } from './middlewares/endpoint.middleware';
import { buyerService } from './services/api/buyer.service';
import { storeService } from './services/api/store.service';
import { log } from './utils/logger.util';

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
    this.app.use(endpointMiddleware.gatewayRequestLogger);
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authService.axiosInstance.defaults.headers['Authorization'] = authHeader;
        buyerService.axiosInstance.defaults.headers['Authorization'] = authHeader;
        storeService.axiosInstance.defaults.headers['Authorization'] = authHeader;
      }
      next();
    });
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
    appRoutes(this.app);
  }

  private errorHandler(): void {
    this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `${fullUrl} endpoint does not exist.`, '');
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'The endpoint called does not exist'
      });
      next();
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
      log.log('error', SERVICE_NAME + ` startServer() method:`, getErrorMessage(error));
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      httpServer.listen(SERVER_PORT, () => {
        log.info(SERVICE_NAME + ` has started on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ` startHttpServer() method:`, getErrorMessage(error));
    }
  }
}
