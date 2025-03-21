import { config } from '@auth/config';
import { authProducer } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { authService } from '@auth/services/auth.service';
import {
  BadRequestError,
  ExchangeNames,
  getCurrentUser,
  IAuthPayload,
  IEmailMessageDetails,
  OkRequestSuccess,
  RoutingKeys
} from '@cngvc/shopi-shared';
import { changePasswordSchema, emailSchema, passwordSchema } from '@cngvc/shopi-types';
import * as argon2 from 'argon2';

import crypto from 'crypto';
import { Request, Response } from 'express';

class PasswordController {
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { error } = await Promise.resolve(emailSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'forgotPassword method error');
    }
    const { email } = req.body;
    const existingUser = await authService.getAuthUserByUsernameOrEmail(email);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials', 'forgotPassword method error');
    }
    const randomBytes: Buffer = crypto.randomBytes(20);
    const randomCharacters: string = randomBytes.toString('hex');
    const date: Date = new Date();
    date.setHours(date.getHours() + 1);
    await authService.updatePasswordToken(existingUser.id!, randomCharacters, date);
    const resetLink = `${config.CLIENT_URL}/reset_password?token=${randomCharacters}`;
    const messageDetails: IEmailMessageDetails = {
      receiverEmail: existingUser.email,
      resetLink,
      username: existingUser.username,
      template: 'forgot-password'
    };
    await authProducer.publishDirectMessage(
      authChannel,
      ExchangeNames.AUTH_NOTIFICATION_EMAIL,
      RoutingKeys.AUTH_NOTIFICATION_EMAIL,
      JSON.stringify(messageDetails)
    );
    new OkRequestSuccess('Password reset email sent.', {}).send(res);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { error } = await Promise.resolve(passwordSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'resetPassword method error');
    }
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match', 'resetPassword method error');
    }

    const existingUser = await authService.getAuthUserByPasswordResetToken(token);
    if (!existingUser) {
      throw new BadRequestError('Reset token has expired', 'resetPassword method error');
    }
    const hashedPassword: string = await argon2.hash(password);
    await authService.updatePassword(existingUser.id!, hashedPassword);
    const messageDetails: IEmailMessageDetails = {
      username: existingUser.username,
      receiverEmail: existingUser.email,
      template: 'reset-password-success'
    };
    await authProducer.publishDirectMessage(
      authChannel,
      ExchangeNames.AUTH_NOTIFICATION_EMAIL,
      RoutingKeys.AUTH_NOTIFICATION_EMAIL,
      JSON.stringify(messageDetails)
    );
    new OkRequestSuccess('Password successfully updated.', {}).send(res);
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const { error } = await Promise.resolve(changePasswordSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'changePassword method error');
    }
    const { newPassword } = req.body;
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const existingUser = await authService.getAuthUserById(currentUser.id);
    if (!existingUser) {
      throw new BadRequestError('Invalid password', 'changePassword method error');
    }
    const hashedPassword: string = await argon2.hash(newPassword);
    await authService.updatePassword(existingUser.id!, hashedPassword);

    const messageDetails: IEmailMessageDetails = {
      receiverEmail: existingUser.email,
      username: existingUser.username,
      template: 'reset-password-success'
    };
    await authProducer.publishDirectMessage(
      authChannel,
      ExchangeNames.AUTH_NOTIFICATION_EMAIL,
      RoutingKeys.AUTH_NOTIFICATION_EMAIL,
      JSON.stringify(messageDetails)
    );
    new OkRequestSuccess('Password successfully updated.', {}).send(res);
  }
}

export const passwordController = new PasswordController();
