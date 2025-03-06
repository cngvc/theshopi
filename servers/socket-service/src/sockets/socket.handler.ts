import { SocketEvents } from '@cngvc/shopi-shared';
import { IMessageDocument } from '@cngvc/shopi-shared-types';
import { config } from '@socket/config';
import { SERVICE_NAME } from '@socket/constants';
import { log } from '@socket/utils/logger.util';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { io, Socket as SocketClient } from 'socket.io-client';

export class SocketHandler {
  io: Server;
  onlineStatusSocket!: SocketClient;
  chatStatusSocket!: SocketClient;

  constructor(httpServer: http.Server) {
    log.info(`🤜 ${SERVICE_NAME} inits socket server`);
    this.io = new Server(httpServer, {
      cors: {
        origin: `${config.GATEWAY_URL}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    this.onlineStatusSocket = io(`${config.ONLINE_STATUS_BASE_URL}`, {
      transports: ['websocket'],
      secure: false
    });
    this.chatStatusSocket = io(`${config.CHAT_BASE_URL}`, {
      transports: ['websocket'],
      secure: false
    });
  }

  public listen() {
    this.onlineStatusSocketConnect();
    this.chatSocketConnect();
    this.io.on('connection', async (socket: Socket) => {
      log.info(`🚗 ${SERVICE_NAME} is listening`);
      socket.on(SocketEvents.LOGGED_IN_USERS, async (username: string) => {
        this.onlineStatusSocket.emit(SocketEvents.LOGGED_IN_USERS, username);
      });
      socket.on(SocketEvents.GET_LOGGED_IN_USERS, async () => {
        this.onlineStatusSocket.emit(SocketEvents.GET_LOGGED_IN_USERS);
      });
      socket.on(SocketEvents.REMOVE_LOGGED_IN_USERS, async (username: string) => {
        this.onlineStatusSocket.emit(SocketEvents.REMOVE_LOGGED_IN_USERS, username);
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

  private onlineStatusSocketConnect(): void {
    this.onlineStatusSocket.on('connect', () => {
      log.info('Online status service socket connected');
    });

    this.onlineStatusSocket.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'Online status service socket disconnect reason:', reason);
      setTimeout(() => {
        this.onlineStatusSocket.connect();
      }, 5000);
    });
    this.onlineStatusSocket.on('connect_error', (error: Error) => {
      log.log('error', 'Online status service socket connection error:', error.message);
      setTimeout(() => {
        this.onlineStatusSocket.connect();
      }, 5000);
    });

    this.onlineStatusSocket.on(SocketEvents.LOGGED_IN_USERS, (data: string[]) => {
      log.info('User has logged in: ' + data);
      this.io.emit(SocketEvents.USER_ONLINE, data);
    });
    this.onlineStatusSocket.on(SocketEvents.GET_LOGGED_IN_USERS, (data: string[]) => {
      this.io.emit(SocketEvents.USER_ONLINE, data);
    });
    this.onlineStatusSocket.on(SocketEvents.REMOVE_LOGGED_IN_USERS, (data: string[]) => {
      log.info('User has logged in: ' + data);
      this.io.emit(SocketEvents.USER_ONLINE, data);
    });
  }

  private chatSocketConnect(): void {
    this.chatStatusSocket.on('connect', () => {
      log.info('Chat service socket connected');
    });

    this.chatStatusSocket.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'Chat service socket disconnect reason:', reason);
      setTimeout(() => {
        this.chatStatusSocket.connect();
      }, 5000);
    });
    this.chatStatusSocket.on('connect_error', (error: Error) => {
      log.log('error', 'Chat service socket connection error:', error.message);
      setTimeout(() => {
        this.chatStatusSocket.connect();
      }, 5000);
    });

    this.chatStatusSocket.on(SocketEvents.MESSAGE_RECEIVED, (data: IMessageDocument) => {
      log.info(`📥 New message from ${data.senderUsername} to ${data.receiverUsername}`);
      this.io.emit(SocketEvents.MESSAGE_RECEIVED, data);
    });
  }
}
