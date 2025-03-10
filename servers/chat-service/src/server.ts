import 'express-async-errors';

import { config } from '@chat/config';
import { SERVER_PORT, SERVICE_NAME } from '@chat/constants';
import { queueConnection } from '@chat/queues/connection';
import { appRoutes } from '@chat/routes';
import { captureError, log } from '@chat/utils/logger.util';
import { AuthMiddleware, CustomError, IAuthPayload, IErrorResponse } from '@cngvc/shopi-shared';
import { Channel } from 'amqplib';
import compression from 'compression';
import cors from 'cors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { verify } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { chatConsumes } from './queues/chat.consumer';
import { SocketHandler } from './sockets/socket.handler';

export let chatChannel: Channel;
export let socketServer: Server;

export class UsersServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  start = (): void => {
    this.standardMiddleware();
    this.securityMiddleware();
    this.routesMiddleware();
    this.startQueues();
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
    chatChannel = (await queueConnection.createConnection()) as Channel;
    await chatConsumes.consumeCreateChatSeeds(chatChannel);
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
      const socketHandler = new SocketHandler(httpServer);
      socketServer = socketHandler.io;
      this.startHttpServer(httpServer);
      socketHandler.listen();
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
