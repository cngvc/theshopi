import { config } from '@payment/config';
import { SERVICE_NAME } from '@payment/constants';
import { captureError, log } from '@payment/utils/logger.util';
import Redis from 'ioredis';

class RedisCache {
  client: Redis;

  constructor() {
    this.client = new Redis(`${config.REDIS_HOST}`);

    this.client.on('connect', () => {
      log.info(`${SERVICE_NAME}: ✅ Redis Connected`);
    });

    this.client.on('reconnecting', () => {
      log.info(`🏋️‍♂️ ${SERVICE_NAME}: Redis Reconnecting`);
    });

    this.client.on('error', (error: unknown) => {
      captureError(error, '❌ Redis connect listener error');
    });
  }

  async checkConnection() {
    try {
      await this.client.ping();
    } catch (error) {
      captureError(error, 'checkConnection');
    }
  }
}

export const redisCache = new RedisCache();
