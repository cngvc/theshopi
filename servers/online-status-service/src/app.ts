import { redisCache } from '@online-status/redis/redis.connection';
import { Server } from '@online-status/server';
import express, { Express } from 'express';

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
