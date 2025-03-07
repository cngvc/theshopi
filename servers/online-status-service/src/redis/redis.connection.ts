import { config } from '@online-status/config';
import { SERVICE_NAME } from '@online-status/constants';
import { log, logCatch } from '@online-status/utils/logger.util';
import Redis from 'ioredis';

class RedisCache {
  client: Redis;

  constructor() {
    this.client = new Redis(`${config.REDIS_HOST}`);

    this.client.on('connect', () => {
      log.info(`${SERVICE_NAME}: Redis Connected`);
    });

    this.client.on('error', (error: unknown) => {
      logCatch(error, 'Redis connect listener error');
    });
  }

  async checkConnection() {
    try {
      await this.client.ping();
    } catch (error) {
      logCatch(error, 'checkConnection');
      this.client = new Redis(`${config.REDIS_HOST}`);
    }
  }
}

export const redisCache = new RedisCache();
