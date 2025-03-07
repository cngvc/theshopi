import { REDIS_USERS_STATE_EXPIRE } from '@online-status/constants';
import { redisCache } from '@online-status/redis/redis.connection';
import { log, logCatch } from '@online-status/utils/logger.util';

class OnlineStatusCache {
  private async checkConnection() {
    try {
      await redisCache.client.ping();
    } catch (error) {
      logCatch(error, 'Redis connection lost, reconnecting...');
      await redisCache.checkConnection();
    }
  }

  public async getLoggedInUsersFromCache(key: string): Promise<string[]> {
    try {
      await this.checkConnection();
      const response: string[] = await redisCache.client.lrange(key, 0, -1);
      return response;
    } catch (error) {
      logCatch(error, 'getLoggedInUsersFromCache');
      return [];
    }
  }

  async saveLoggedInUserToCache(key: string, value: string): Promise<string[]> {
    try {
      await this.checkConnection();
      const index: number | null = await redisCache.client.lpos(key, value);
      if (index === null) {
        await redisCache.client.lpush(key, value);
        await redisCache.client.expire(key, REDIS_USERS_STATE_EXPIRE);
        log.info(`User ${value} added from cache under key ${key}`);
      } else {
        log.info(`User ${value} already exists in cache under key ${key}`);
      }
      const response: string[] = await redisCache.client.lrange(key, 0, -1);
      return response;
    } catch (error) {
      logCatch(error, 'saveLoggedInUserToCache');
      return [];
    }
  }

  async removeLoggedInUserFromCache(key: string, value: string): Promise<string[]> {
    try {
      await this.checkConnection();
      const removedCount = await redisCache.client.lrem(key, 1, value);
      if (removedCount > 0) {
        log.info(`User ${value} removed from cache under key ${key}`);
      } else {
        log.warn(`User ${value} not found in cache under key ${key}`);
      }
      const response: string[] = await redisCache.client.lrange(key, 0, -1);
      if (response.length === 0) {
        await redisCache.client.del(key);
        log.info(`Key ${key} deleted as list is now empty`);
      }
      return response;
    } catch (error) {
      logCatch(error, 'removeLoggedInUserFromCache');
      return [];
    }
  }
}

export const onlineStatusCache = new OnlineStatusCache();
