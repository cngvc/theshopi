import { SocketEvents } from '@cngvc/shopi-shared';
import { config } from '@online-status/config';
import { SERVICE_NAME } from '@online-status/constants';
import { onlineStatusCache } from '@online-status/redis/online-status-cache';
import { log } from '@online-status/utils/logger.util';
import { createAdapter } from '@socket.io/redis-adapter';
import http from 'http';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';

export class SocketHandler {
  io: Server;

  constructor(httpServer: http.Server) {
    log.info(`🤜 ${SERVICE_NAME} inits socket`);
    this.io = new Server(httpServer, {
      cors: {
        origin: `${config.SOCKET_BASE_URL}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
  }

  async createSocket(): Promise<void> {
    const pub = new Redis(`${config.REDIS_HOST}`);
    const sub = pub.duplicate();
    try {
      await Promise.all([pub.connect(), sub.connect()]);
      if (pub.status !== 'ready' || sub.status !== 'ready') {
        throw new Error(`${SERVICE_NAME} createSocket method`);
      }
      this.io.adapter(createAdapter(pub, sub));
    } catch (error) {
      log.log('error', `${SERVICE_NAME} createSocket method`);
    }
  }

  public listen() {
    this.io.on('connection', async (socket: Socket) => {
      log.info(`🚗 ${SERVICE_NAME} is listening`);
      socket.on(SocketEvents.LOGGED_IN_USERS, async (username: string) => {
        const response: string[] = await onlineStatusCache.saveLoggedInUserToCache(SocketEvents.LOGGED_IN_USERS, username);
        this.io.emit(SocketEvents.LOGGED_IN_USERS, response);
      });
      socket.on(SocketEvents.GET_LOGGED_IN_USERS, async () => {
        const response: string[] = await onlineStatusCache.getLoggedInUsersFromCache(SocketEvents.LOGGED_IN_USERS);
        this.io.emit(SocketEvents.GET_LOGGED_IN_USERS, response);
      });

      socket.on(SocketEvents.REMOVE_LOGGED_IN_USERS, async (username: string) => {
        const response: string[] = await onlineStatusCache.removeLoggedInUserFromCache(SocketEvents.LOGGED_IN_USERS, username);
        this.io.emit(SocketEvents.REMOVE_LOGGED_IN_USERS, response);
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
