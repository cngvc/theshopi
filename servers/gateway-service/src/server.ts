import 'express-async-errors';

import { CustomError, getErrorMessage, IErrorResponse } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { SERVER_PORT, SERVICE_NAME } from '@gateway/constants';
import { appRoutes } from '@gateway/routes';
import { authService } from '@gateway/services/api/auth.service';
import { isAxiosError } from 'axios';
import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { StatusCodes } from 'http-status-codes';
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
    this.errorHandler();
    this.startServer();
  }

  private securityMiddleware(): void {
    this.app.set('trust proxy', 1);
    this.app.use(
      cookieSession({
        name: 'session',
        keys: [`${config.COOKIE_SECRET_KEY_FIRST}`, `${config.COOKIE_SECRET_KEY_SECOND}`],
        maxAge: 24 * 7 * 3600 * 1000,
        secure: config.NODE_ENV !== 'development'
      })
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: `${config.CLIENT_URL}`,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.session?.jwt) {
        req.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        authService.axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
      }
      next();
    });
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

    this.app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.log('error', SERVICE_NAME + ` ${error.comingFrom}:`, error.message);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeError());
      }
      if (isAxiosError(error)) {
        log.log(
          'error',
          `GatewayService Axios Error - ${error?.response?.data?.comingFrom}:`,
          error?.response?.data?.message ?? 'Error occurred.'
        );
        res
          .status(error?.response?.data?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error?.response?.data?.message ?? 'Error occurred.' });
      }
      next(error);
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
