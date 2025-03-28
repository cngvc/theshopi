import { database } from '@product/database';
import { Server } from '@product/server';
import express, { Express } from 'express';

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
