import { NextFunction, Request, Response } from 'express';

class UserAgentMiddleware {
  attachUseragentToBody(req: Request, res: Response, next: NextFunction) {
    const deviceInfo = `${req.useragent?.os}-${req.useragent?.browser}`;
    req.body = { ...req.body, deviceInfo };
    next();
  }
}
export const userAgentMiddleware = new UserAgentMiddleware();
