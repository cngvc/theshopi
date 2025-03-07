import { IMessageDocument, SocketEvents } from '@cngvc/shopi-shared-types';
import { config } from '@socket/config';
import { SERVICE_NAME } from '@socket/constants';
import { log } from '@socket/utils/logger.util';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { io, Socket as SocketClient } from 'socket.io-client';

export class SocketHandler {
  io: Server;
  onlineStatusSocket!: SocketClient;
  chatSocket!: SocketClient;

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
    this.chatSocket = io(`${config.CHAT_BASE_URL}`, {
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
      socket.on(SocketEvents.USER_JOIN_ROOM, async (conversationId: string) => {
        log.info('A new user joins room: ', conversationId);
        socket.join(`chatroom:${conversationId}`);
      });
      socket.on(SocketEvents.USER_LEFT_ROOM, async (conversationId: string) => {
        log.info('A user leaves room: ', conversationId);
        socket.leave(`chatroom:${conversationId}`);
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
    this.chatSocket.on('connect', () => {
      log.info('Chat service socket connected');
    });
    this.chatSocket.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'Chat service socket disconnect reason:', reason);
      setTimeout(() => {
        this.chatSocket.connect();
      }, 5000);
    });
    this.chatSocket.on('connect_error', (error: Error) => {
      log.log('error', 'Chat service socket connection error:', error.message);
      setTimeout(() => {
        this.chatSocket.connect();
      }, 5000);
    });
    this.chatSocket.on(SocketEvents.MESSAGE_RECEIVED, (data: IMessageDocument) => {
      log.info(`📥 New message from ${data.senderUsername} to ${data.receiverUsername}`);
      const roomId = `chatroom:${data.conversationId}`;
      const socketsInRoom = this.io.sockets.adapter.rooms.get(roomId);
      if (socketsInRoom) {
        log.info(`👥 Users in room ${roomId}: ${socketsInRoom.size}`);
      } else {
        log.info(`🚫 Room ${roomId} is empty or does not exist.`);
      }
      this.io.to(roomId).emit(SocketEvents.MESSAGE_RECEIVED, data);
    });
  }
}
