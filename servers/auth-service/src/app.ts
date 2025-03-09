import { database } from '@auth/database';
import { AuthServer } from '@auth/server';
import express, { Express } from 'express';
import { redisCache } from './redis/redis.connection';

class Application {
  public initialize() {
    const app: Express = express();
    const server = new AuthServer(app);
    database.connection();
    server.start();
    redisCache.checkConnection();
  }
}

const application = new Application();
application.initialize();
