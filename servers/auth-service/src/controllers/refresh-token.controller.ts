import { authService } from '@auth/services/auth.service';
import { BadRequestError, getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class RefreshTokenController {
  async refreshToken(req: Request, res: Response): Promise<void> {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const existingUser = await authService.getAuthUserById(currentUser.id);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials', 'refreshToken method error');
    }
    const token = authService.signToken(existingUser.id!, existingUser.email!, existingUser.username!);
    if (!token) {
      throw new BadRequestError('Error when signing token', 'refreshToken method error');
    }
    new OkRequestSuccess('Refresh token successfully.', {
      accessToken: token
    }).send(res);
  }
}

export const refreshTokenController = new RefreshTokenController();
