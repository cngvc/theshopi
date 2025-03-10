import { database } from '@user/database';
import { UserServer } from '@user/server';
import express, { Express } from 'express';

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
