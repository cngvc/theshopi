import { DEFAULT_DEVICE } from '@gateway/constants';
import { log } from '@gateway/utils/logger.util';
import { NextFunction, Request, Response } from 'express';

class EndpointMiddleware {
  gatewayRequestLogger = (req: Request, res: Response, next: NextFunction) => {
    const endpoint = req.originalUrl;
    const method = req.method;
    log.info(`📌 [${method}] ${endpoint} | ${req.headers['x-device-fingerprint'] || DEFAULT_DEVICE}`);
    next();
  };
}
export const endpointMiddleware = new EndpointMiddleware();
