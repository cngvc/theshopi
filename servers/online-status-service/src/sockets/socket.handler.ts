import { SocketEvents } from '@cngvc/shopi-shared';
import { config } from '@online-status/config';
import { onlineStatusCache } from '@online-status/redis/online-status-cache';
import { createAdapter } from '@socket.io/redis-adapter';
import http from 'http';
import { createClient } from 'redis';
import { Server, Socket } from 'socket.io';

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

  async createSocket(): Promise<void> {
    const pub = createClient({ url: config.REDIS_HOST });
    const sub = pub.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    this.io.adapter(createAdapter(pub, sub));
  }

  public listen(): void {
    this.io.on('connection', async (socket: Socket) => {
      socket.on(SocketEvents.LOGGED_IN_USERS, async (username: string) => {
        const response: string[] = await onlineStatusCache.saveLoggedInUserToCache(SocketEvents.LOGGED_IN_USERS, username);
        this.io.emit('online', response);
      });
      socket.on(SocketEvents.GET_LOGGED_IN_USERS, async () => {
        const response: string[] = await onlineStatusCache.getLoggedInUsersFromCache(SocketEvents.LOGGED_IN_USERS);
        this.io.emit('online', response);
      });

      socket.on(SocketEvents.REMOVE_LOGGED_IN_USERS, async (username: string) => {
        const response: string[] = await onlineStatusCache.removeLoggedInUserFromCache(SocketEvents.LOGGED_IN_USERS, username);
        this.io.emit('online', response);
      });
    });
  }
}
