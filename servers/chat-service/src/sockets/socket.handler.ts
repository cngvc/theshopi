import { config } from '@chat/config';
import http from 'http';
import { Server } from 'socket.io';

export class SocketHandler {
  io: Server;

  constructor(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: {
        origin: `${config.CLIENT_URL}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
  }
  public listen(): void {}
}
