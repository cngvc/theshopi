import express, { Express } from 'express';
import { redisCache } from './redis/redis.connection';
import { Server } from './server';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new Server(app);
    server.start();
    redisCache.checkConnection();
  }
}

const application = new Application();
application.initialize();
