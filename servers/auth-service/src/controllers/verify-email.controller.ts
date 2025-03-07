import { authService } from '@auth/services/auth.service';
import { BadRequestError, OkRequestSuccess } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class VerifyEmailController {
  async verifyEmail(req: Request, res: Response): Promise<void> {
    const token = req.query?.token as string;
    const existingUser = await authService.getAuthUserByVerificationToken(token);
    if (!existingUser) {
      throw new BadRequestError('Verification token is either invalid or is already used.', 'verifyEmail method error');
    }
    await authService.updateVerifyEmailField(existingUser.id!, true);
    const updatedUser = await authService.getAuthUserById(existingUser.id!);
    new OkRequestSuccess('Email verified successfully.', { user: updatedUser }).send(res);
  }
}

export const verifyEmailController = new VerifyEmailController();
