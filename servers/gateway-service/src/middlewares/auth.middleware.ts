import { IAuthPayload, NotAuthorizedError } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { SERVICE_NAME } from '@gateway/constants';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

class AuthMiddleware {
  constructor() {}

  public verifySessionJWT(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new NotAuthorizedError('Authorization token is missing or invalid.', SERVICE_NAME + ' verifyBearerToken() method');
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = verify(token, `${config.AUTH_JWT_TOKEN_SECRET}`) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is not available, please login again.', SERVICE_NAME + ' verifyUser() method');
    }
    next();
  }
  public checkAuthentication(req: Request, _: Response, next: NextFunction) {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route.', SERVICE_NAME + ' checkAuthentication() method');
    }
    next();
  }
}

export const authMiddleware = new AuthMiddleware();
