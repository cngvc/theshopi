import { NotAuthorizedError } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { NextFunction, Request, Response } from 'express';

export class VerifyUserMiddleware {
  private constructor() {}
  static verifyUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.currentUser!.id;
      if (!userId) {
        throw new NotAuthorizedError('User ID is missing in request.', 'verifyUserExists');
      }
      const { data } = await authService.getCurrentUser();
      if (!data) {
        throw new NotAuthorizedError('User is not found or banned.', 'verifyUserExists');
      }
      next();
    } catch (error) {
      throw new NotAuthorizedError('Failed to verify user existence.', 'verifyUserExists');
    }
  };
}
