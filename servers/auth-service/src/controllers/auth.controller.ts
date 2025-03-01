import { config } from '@auth/config';
import { authProducer } from '@auth/queues/auth.producer';
import { signinSchema } from '@auth/schemes/signin.scheme';
import { signupSchema } from '@auth/schemes/signup.scheme';
import { authChannel } from '@auth/server';
import { authService } from '@auth/services/auth.service';
import { BadRequestError, ExchangeNames, IAuthDocument, IEmailMessageDetails, isEmail, lowerCase, RoutingKeys } from '@cngvc/shopi-shared';
import { compare } from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    const { error } = await Promise.resolve(signupSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error?.details[0].message, 'signup() method error');
    }
    const { username, email, password } = req.body;
    const existingUser = await authService.getAuthUserByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new BadRequestError('User already exists', 'signup() method error');
    }
    const profilePublicId = uuidv4();
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    const authData: IAuthDocument = {
      username: lowerCase(username),
      email: lowerCase(email),
      profilePublicId,
      password,
      emailVerificationToken: randomCharacters
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
      } as IEmailMessageDetails),
      'Verify email message has been sent to notification service.'
    );

    const jwt = authService.signToken(result.id!, result.email!, result.username!);
    if (!jwt) {
      throw new BadRequestError('Error when signing token', 'RefreshToken refreshToken() method error');
    }
    res.status(StatusCodes.CREATED).json({ message: 'User created successfully', token: jwt });
  }
  async signin(req: Request, res: Response): Promise<void> {
    const { error } = await Promise.resolve(signinSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'signin() method error');
    }
    const { username, password } = req.body;
    const isValidEmail: boolean = isEmail(username);
    const existingUser = !isValidEmail ? await authService.getAuthUserByUsername(username) : await authService.getAuthUserByEmail(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials', 'signin() method error');
    }
    const passwordsMatch: boolean = await compare(password, `${existingUser.password}`);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials', 'signin() method error');
    }
    let message = 'User login successfully';
    const jwt = authService.signToken(existingUser.id!, existingUser.email!, existingUser.username!);
    if (!jwt) {
      throw new BadRequestError('Error when signing token', 'signin() method error');
    }
    res.status(StatusCodes.OK).json({ message, token: jwt });
  }
}

export const authController = new AuthController();
