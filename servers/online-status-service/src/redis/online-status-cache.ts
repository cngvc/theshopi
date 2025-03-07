import { REDIS_USERS_STATE_EXPIRE } from '@online-status/constants';
import { redisCache } from '@online-status/redis/redis.connection';
import { log } from '@online-status/utils/logger.util';

class OnlineStatusCache {
  async getLoggedInUsers(key: string): Promise<string[]> {
    const response: string[] = await redisCache.client.lrange(key, 0, -1);
    return response;
  }

  async saveLoggedInUser(key: string, value: string): Promise<string[]> {
    const index: number | null = await redisCache.client.lpos(key, value);
    if (index === null) {
      await redisCache.client.lpush(key, value);
      await redisCache.client.expire(key, REDIS_USERS_STATE_EXPIRE);
    } else {
      log.info(`User ${value} already exists in cache under key ${key}`);
    }
    const response: string[] = await redisCache.client.lrange(key, 0, -1);
    return response;
  }

  async removeLoggedInUser(key: string, value: string): Promise<string[]> {
    await redisCache.client.lrem(key, 1, value);
    const response: string[] = await redisCache.client.lrange(key, 0, -1);
    if (response.length === 0) {
      await redisCache.client.del(key);
      log.info(`Key ${key} deleted as list is now empty`);
    }
    return response;
  }
}

export const onlineStatusCache = new OnlineStatusCache();
