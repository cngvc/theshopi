import { database } from '@products/database';
import { ProductServer } from '@products/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new ProductServer(app);
    database.connection();
    server.start();
  }
}

const application = new Application();
application.initialize();
