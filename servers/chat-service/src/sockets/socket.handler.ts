import { config } from '@chat/config';
import { SERVICE_NAME } from '@chat/constants';
import { log } from '@chat/utils/logger.util';
import { SocketEvents } from '@cngvc/shopi-types';
import http from 'http';
import { Server, Socket } from 'socket.io';

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
  public listen() {
    this.io.on('connection', async (socket: Socket) => {
      socket.on(SocketEvents.USER_JOIN_ROOM, async (conversationPublicId: string) => {
        log.info('A new user joins room: ', conversationPublicId);
        socket.join(`chatroom:${conversationPublicId}`);
      });
      socket.on(SocketEvents.USER_LEFT_ROOM, async (conversationPublicId: string) => {
        log.info('A user leaves room: ', conversationPublicId);
        socket.leave(`chatroom:${conversationPublicId}`);
      });
    });
    this.io.on('connect_error', (err) => {
      console.log(err);
    });
    this.io.on('connect_failed', (err) => {
      console.log(err);
    });
    this.io.on('disconnect', (err) => {
      console.log(err);
    });
  }
}
