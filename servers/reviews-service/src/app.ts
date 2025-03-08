import { UsersServer } from '@reviews/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new UsersServer(app);
    server.start();
  }
}

const application = new Application();
application.initialize();
