import { redisCache } from '@online-status/redis/redis.connection';
import { OnlineStatusServer } from '@online-status/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new OnlineStatusServer(app);
    server.start();
    redisCache.connect();
  }
}

const application = new Application();
application.initialize();
