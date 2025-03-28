import { database } from '@chat/database';
import express, { Express } from 'express';
import { Server } from './server';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new Server(app);
    database.connection();
    server.start();
  }
}

const application = new Application();
application.initialize();
