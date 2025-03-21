import { config } from '@auth/config';
import { DEFAULT_DEVICE } from '@auth/constants';
import { authProducer } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { authService } from '@auth/services/auth.service';
import { keyTokenService } from '@auth/services/key-token.service';
import {
  BadRequestError,
  CreatedRequestSuccess,
  ExchangeNames,
  getCurrentUser,
  IAuthDocument,
  IAuthPayload,
  IEmailMessageDetails,
  lowerCase,
  OkRequestSuccess,
  RoutingKeys
} from '@cngvc/shopi-shared';
import { signinSchema, signupSchema } from '@cngvc/shopi-types';
import * as argon2 from 'argon2';
import crypto from 'crypto';
import { Request, Response } from 'express';

class AuthController {
  async signup(
    req: Request<
      {},
      {},
      {
        username: string;
        email: string;
        password: string;
        deviceInfo?: string;
      }
    >,
    res: Response
  ): Promise<void> {
    const { error } = await Promise.resolve(signupSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error?.details[0].message, 'signup method error validation');
    }
    const { username, email, password, deviceInfo = DEFAULT_DEVICE } = req.body;
    const existingUser = await authService.getAuthUserByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new BadRequestError('User already exists', 'signup method error existing');
    }
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    const authData: IAuthDocument = {
      username: lowerCase(username),
      email: lowerCase(email),
      password,
      emailVerificationToken: randomCharacters,
      emailVerified: false
    };
    const result = await authService.createAuthUser(authData);
    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token${authData.emailVerificationToken}`;
    await authProducer.publishDirectMessage(
      authChannel,
      ExchangeNames.AUTH_NOTIFICATION_EMAIL,
      RoutingKeys.AUTH_NOTIFICATION_EMAIL,
      JSON.stringify({
        receiverEmail: result.email,
        verifyLink: verificationLink,
        template: 'verify-email'
      } as IEmailMessageDetails)
    );
    const tokens = await keyTokenService.generateTokens(result, deviceInfo);
    if (!tokens) {
      throw new BadRequestError('Error when signing token', 'signup method error');
    }
    new CreatedRequestSuccess('User created successfully', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: result.id,
        username: result.username,
        email: result.email
      }
    }).send(res);
  }

  async signin(
    req: Request<
      {},
      {},
      {
        username: string;
        password: string;
        deviceInfo?: string;
      }
    >,
    res: Response
  ): Promise<void> {
    const { error } = await Promise.resolve(signinSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'signin method error validation');
    }
    const { username, password, deviceInfo = DEFAULT_DEVICE } = req.body;
    const existingUser = await authService.getAuthUserByUsernameOrEmail(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials', 'signin method error existing');
    }
    const passwordsMatch: boolean = await argon2.verify(`${existingUser.password}`, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials', 'signin method error password');
    }
    await keyTokenService.deleteKeyToken({ authId: existingUser.id!, deviceInfo });
    const tokens = await keyTokenService.generateTokens(existingUser, deviceInfo);
    if (!tokens) {
      throw new BadRequestError('Error when signing token', 'signin method error');
    }
    new OkRequestSuccess('User login successfully', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email
      }
    }).send(res);
  }

  async logout(
    req: Request<
      {},
      {},
      {
        refreshToken?: string;
      }
    >,
    res: Response
  ): Promise<void> {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    if (req.body.refreshToken) {
      await keyTokenService.deleteKeyToken({ authId: currentUser.id, refreshToken: req.body.refreshToken });
    } else {
      await keyTokenService.deleteKeyToken({ authId: currentUser.id });
    }
    new OkRequestSuccess('User logout successfully', {}).send(res);
  }
}

export const authController = new AuthController();
