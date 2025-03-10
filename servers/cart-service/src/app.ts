import { UserServer } from '@cart/server';
import express, { Express } from 'express';
import { redisCache } from './redis/redis.connection';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new UserServer(app);
    server.start();
    redisCache.checkConnection();
  }
}

const application = new Application();
application.initialize();
