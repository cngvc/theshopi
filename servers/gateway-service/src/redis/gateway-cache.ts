import { log, logCatch } from '@gateway/utils/logger.util';
import { redisCache } from './redis.connection';

class GatewayCache {
  private async checkConnection() {
    if (!redisCache.client.isOpen) {
      await redisCache.redisConnect();
    }
  }
  async saveLoggedInUserToCache(key: string, value: string): Promise<string[]> {
    try {
      await this.checkConnection();
      const index: number | null = await redisCache.client.LPOS(key, value);
      if (index === null) {
        await redisCache.client.LPUSH(key, value);
        log.info(`User ${value} added from cache with key ${key}`);
      }
      const response: string[] = await redisCache.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      logCatch(error, 'saveLoggedInUserToCache');
      return [];
    }
  }

  async removeLoggedInUserFromCache(key: string, value: string): Promise<string[]> {
    try {
      await this.checkConnection();
      await redisCache.client.LREM(key, 1, value);
      log.info(`User ${value} removed from cache with key ${key}`);
      const response: string[] = await redisCache.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      logCatch(error, 'removeLoggedInUserFromCache');
      return [];
    }
  }
}

export const gatewayCache = new GatewayCache();
