import { CustomError, RateLimitedError, ServerError } from '@cngvc/shopi-shared';
import { redisCache } from '@gateway/redis/redis.connection';
import { NextFunction, Request, Response } from 'express';

const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW = 60;

class RateLimitMiddleware {
  redisRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || 'unknown';
      const key = `user-ip:${ip}`;
      const requestedByIP = await redisCache.client.incr(key);
      if (requestedByIP === 1) {
        await redisCache.client.expire(key, RATE_LIMIT_WINDOW);
      }
      if (requestedByIP > RATE_LIMIT_MAX) {
        throw new RateLimitedError('Too many requests, please wait before retrying.', 'redisRateLimit');
      }
    } catch (error) {
      if (error instanceof CustomError) {
        return next(error);
      }
      throw new ServerError('Internal error', 'redisRateLimit');
    }
    next();
  };
}
export const rateLimitMiddleware = new RateLimitMiddleware();
