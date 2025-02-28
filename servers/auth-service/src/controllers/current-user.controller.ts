import { authService } from '@auth/services/auth.service';
import { generateRandomCharacters } from '@auth/utils/generate.util';
import { BadRequestError, NotFoundError } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class CurrentUserController {
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const existingUser = await authService.getAuthUserById(req.currentUser!.id);
    if (!existingUser) {
      throw new NotFoundError('User not found', 'getCurrentUser() method');
    }
    res.status(StatusCodes.OK).json({ message: 'Authenticated user', user: existingUser });
  }

  async resendEmail(req: Request, res: Response): Promise<void> {
    const existingUser = await authService.getAuthUserById(req.currentUser!.id);
    if (!existingUser) {
      throw new BadRequestError('Email is invalid', 'resentEmail() method error');
    }
    if (existingUser.emailVerified) {
      throw new BadRequestError('Email has been verified', 'resentEmail() method error');
    }
    const randomCharacters = await generateRandomCharacters();
    await authService.updateVerifyEmailField(existingUser.id!, false, randomCharacters);
    const updatedUser = await authService.getAuthUserById(existingUser.id!);
    res.status(StatusCodes.OK).json({ message: 'Email verification sent', user: updatedUser });
  }
}

export const currentUserController = new CurrentUserController();
