import { redisCache } from './redis.connection';

class AuthCache {
  async getUserId(id: string): Promise<{ id: string } | null> {
    const response = await redisCache.client.get(`user:${id}`);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  }
  async saveUserId(id: string): Promise<void> {
    await redisCache.client.setex(`user:${id}`, 84000, '1');
  }
  async removeUserId(id: string): Promise<void> {
    await redisCache.client.del(`user:${id}`);
  }
}
export const authCache = new AuthCache();
