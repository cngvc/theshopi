import { log } from '@gateway/utils/logger.util';
import { NextFunction, Request, Response } from 'express';

class EndpointMiddleware {
  gatewayRequestLogger = (req: Request, res: Response, next: NextFunction) => {
    const endpoint = req.originalUrl;
    const method = req.method;
    log.info(`📌 [${method}] ${endpoint}`);
    next();
  };
}
export const endpointMiddleware = new EndpointMiddleware();
