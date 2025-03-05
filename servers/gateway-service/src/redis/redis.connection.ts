import { config } from '@gateway/config';
import { SERVICE_NAME } from '@gateway/constants';
import { log, logCatch } from '@gateway/utils/logger.util';
import { createClient } from '@redis/client';
import { RedisClient } from './types';

class RedisCache {
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: config.REDIS_HOST });
  }

  async redisConnect() {
    try {
      await this.client.connect();
      log.info(SERVICE_NAME + ` Redis Connection: ${await this.client.ping()}`);
      this.client.on('error', (error: unknown) => {
        logCatch(error, 'redisConnect listener error');
      });
    } catch (error) {
      logCatch(error, 'redisConnect');
    }
  }
}

export const redisCache = new RedisCache();
