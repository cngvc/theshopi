'use client';

import { SERVER_URL } from '@/lib/configs';
import { io, Socket } from 'socket.io-client';

class BaseSocketClient {
  socket: Socket;
  constructor() {
    this.socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      secure: false
    });
    this.listen();
  }

  listen() {
    this.socket.on('connect', () => {
      console.log('👆 Connected to server');
    });

    this.socket.on('disconnect', (reason: Socket.DisconnectReason) => {
      console.log(`😞 Gateway socket disconnect, reason: ${reason}`);
      this.socket.connect();
    });

    this.socket.on('connect_error', (error: Error) => {
      console.log(`👇 Gateway socket connect error: ${error.message}`);
      this.socket.connect();
    });
  }
}
export const socketClient = new BaseSocketClient();
