import express, { Express } from 'express';
import { database } from './database';
import { Server } from './server';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new Server(app);
    server.start();
    database.connection();
  }
}

const application = new Application();
application.initialize();
