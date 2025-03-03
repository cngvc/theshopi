import { authService } from '@auth/services/auth.service';
import { BadRequestError } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class RefreshTokenController {
  async refreshToken(req: Request, res: Response): Promise<void> {
    const existingUser = await authService.getAuthUserById(req.currentUser!.id);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials', 'refreshToken() method error');
    }
    const token = authService.signToken(existingUser.id!, existingUser.email!, existingUser.username!);
    if (!token) {
      throw new BadRequestError('Error when signing token', 'refreshToken() method error');
    }
    res.status(StatusCodes.OK).json({ message: 'Refresh token successfully', token });
  }
}

export const refreshTokenController = new RefreshTokenController();
