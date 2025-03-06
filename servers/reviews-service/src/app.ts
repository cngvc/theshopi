import { UsersServer } from '@cart/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new UsersServer(app);
    // database.connection();
    server.start();
  }
}

const application = new Application();
application.initialize();
