import { config } from '@auth/config';
import { authProducer } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { authService } from '@auth/services/auth.service';
import { generateRandomCharacters } from '@auth/utils/generate.util';
import {
  BadRequestError,
  ExchangeNames,
  getCurrentUser,
  IAuthPayload,
  IEmailMessageDetails,
  lowerCase,
  NotFoundError,
  OkRequestSuccess,
  RoutingKeys
} from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class CurrentUserController {
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    console.log(currentUser);
    const existingUser = await authService.getAuthUserById(currentUser.id);
    if (!existingUser) {
      throw new NotFoundError('User not found', 'getCurrentUser');
    }
    new OkRequestSuccess('Authenticated user', { user: existingUser }).send(res);
  }

  async resendEmail(req: Request, res: Response): Promise<void> {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const existingUser = await authService.getAuthUserById(currentUser.id);
    if (!existingUser) {
      throw new BadRequestError('Email is invalid', 'resentEmail method error');
    }
    if (existingUser.emailVerified) {
      throw new BadRequestError('Email has been verified', 'resentEmail method error');
    }
    const randomCharacters = await generateRandomCharacters();
    await authService.updateVerifyEmailField(existingUser.id!, false, randomCharacters);

    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;
    const messageDetails: IEmailMessageDetails = {
      receiverEmail: lowerCase(existingUser.email!),
      verifyLink: verificationLink,
      template: 'verify-email'
    };
    await authProducer.publishDirectMessage(
      authChannel,
      ExchangeNames.AUTH_NOTIFICATION_EMAIL,
      RoutingKeys.AUTH_NOTIFICATION_EMAIL,
      JSON.stringify(messageDetails)
    );
    const updatedUser = await authService.getAuthUserById(existingUser.id!);
    new OkRequestSuccess('Email verification sent', { user: updatedUser }).send(res);
  }
}

export const currentUserController = new CurrentUserController();
