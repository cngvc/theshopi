import { UserServer } from '@order/server';
import express, { Express } from 'express';
import { database } from './database';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new UserServer(app);
    database.connection();
    server.start();
  }
}

const application = new Application();
application.initialize();
