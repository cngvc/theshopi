import { NotAuthorizedError } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { NextFunction, Request, Response } from 'express';

export class VerifyUserMiddleware {
  private constructor() {}
  static checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.currentUser!.id;
      if (!userId) {
        throw new NotAuthorizedError('User ID is missing in request.', 'checkUserExists');
      }
      const { data } = await authService.checkUserExists();
      if (!data) {
        throw new NotAuthorizedError('User is not found or banned.', 'checkUserExists');
      }
      next();
    } catch (error) {
      throw new NotAuthorizedError('Failed to verify user existence.', 'checkUserExists');
    }
  };
}
