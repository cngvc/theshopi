import { NextFunction, Request, Response } from 'express';

class UserAgentMiddleware {
  attachUseragent(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
export const userAgentMiddleware = new UserAgentMiddleware();
