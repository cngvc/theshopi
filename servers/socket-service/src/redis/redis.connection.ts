import { config } from '@socket/config';
import { SERVICE_NAME } from '@socket/constants';
import { RedisClient } from '@socket/redis/types';
import { log, logCatch } from '@socket/utils/logger.util';
import { createClient } from '@redis/client';

class RedisCache {
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: config.REDIS_HOST });
  }

  async connect() {
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
