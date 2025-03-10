import { UserServer } from '@reviews/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new UserServer(app);
    server.start();
  }
}

const application = new Application();
application.initialize();
