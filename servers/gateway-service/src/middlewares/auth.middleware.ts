import { CustomError, NotAuthorizedError, ServerError } from '@cngvc/shopi-shared';
import { grpcAuthClient } from '@gateway/grpc/clients/auth-client.grpc';
import { NextFunction, Request, Response } from 'express';

export class AuthMiddleware {
  async verifyUserJwt(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    // that means AttachUser-middleware has completed the verification job !!!
    if (req.headers['x-user']) return next();
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new NotAuthorizedError('Authorization token is missing or invalid.', 'verifyUserJwt');
      }
      const token = authHeader.split(' ')[1];
      const fingerprint = req.headers['x-device-fingerprint'] as string;

      const { payload } = await grpcAuthClient.getCurrentUserByJwt(token, fingerprint);
      if (!payload) {
        throw new NotAuthorizedError('Token is not available, please login again.', 'verifyUserJwt');
      }
      req.headers['x-user'] = JSON.stringify(payload);
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        return next(error);
      }
      throw new ServerError('Internal error.', 'verifyUserJwt');
    }
    next();
  }

  async attachUser(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const fingerprint = req.headers['x-device-fingerprint'] as string;
        const { payload } = await grpcAuthClient.getCurrentUserByJwt(token, fingerprint);
        if (payload) {
          req.headers['x-user'] = JSON.stringify(payload);
        }
      } catch (error) {}
    }
    next();
  }
}

export const authMiddleware = new AuthMiddleware();
