import { authService } from '@auth/services/auth.service';
import { BadRequestError } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class VerifyEmailController {
  async verifyEmail(req: Request, res: Response): Promise<void> {
    const token = req.query?.token as string;
    const existingUser = await authService.getAuthUserByVerificationToken(token);
    if (!existingUser) {
      throw new BadRequestError('Verification token is either invalid or is already used.', 'verifyEmail() method error');
    }
    await authService.updateVerifyEmailField(existingUser.id!, true);
    const updatedUser = await authService.getAuthUserById(existingUser.id!);
    res.status(StatusCodes.OK).json({ message: 'Email verified successfully.', user: updatedUser });
  }
}

export const verifyEmailController = new VerifyEmailController();
