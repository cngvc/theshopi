import { SocketServer } from '@socket/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new SocketServer(app);
    server.start();
  }
}

const application = new Application();
application.initialize();
