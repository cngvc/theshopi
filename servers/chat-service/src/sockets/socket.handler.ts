import { config } from '@chat/config';
import { SERVICE_NAME } from '@chat/constants';
import { log } from '@chat/utils/logger.util';
import http from 'http';
import { Server } from 'socket.io';

export class SocketHandler {
  io: Server;

  constructor(httpServer: http.Server) {
    log.info(`🤜 ${SERVICE_NAME} inits socket`);
    this.io = new Server(httpServer, {
      cors: {
        origin: `${config.CLIENT_URL}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
  }
  public listen(): void {}
}
