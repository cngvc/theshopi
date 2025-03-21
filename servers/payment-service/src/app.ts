import { UserServer } from '@payment/server';
import express, { Express } from 'express';
import { database } from './database';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new UserServer(app);
    server.start();
    database.connection();
  }
}

const application = new Application();
application.initialize();
