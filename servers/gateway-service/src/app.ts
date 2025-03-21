import { GatewayServer } from '@gateway/server';
import express, { Express } from 'express';
import { redisCache } from './redis/redis.connection';

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: GatewayServer = new GatewayServer(app);
    server.start();
    redisCache.checkConnection();
  }
}

const application: Application = new Application();
application.initialize();
