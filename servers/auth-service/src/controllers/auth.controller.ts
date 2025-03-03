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
      throw new BadRequestError(error?.details[0].message, 'signup() method error validation');
    }
    const { username, email, password } = req.body;
    const existingUser = await authService.getAuthUserByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new BadRequestError('User already exists', 'signup() method error existing');
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

    const token = authService.signToken(result.id!, result.email!, result.username!);
    if (!token) {
      throw new BadRequestError('Error when signing token', 'RefreshToken refreshToken() method error');
    }
    res.status(StatusCodes.CREATED).json({
      message: 'User created successfully',
      accessToken: token,
      user: {
        id: result.id,
        username: result.username,
        email: result.email
      }
    });
  }
  async signin(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const { error } = await Promise.resolve(signinSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'signin() method error validation');
    }
    const { username, password } = req.body;
    const isValidEmail: boolean = isEmail(username);
    const existingUser = !isValidEmail ? await authService.getAuthUserByUsername(username) : await authService.getAuthUserByEmail(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials', 'signin() method error existing');
    }
    const passwordsMatch: boolean = await compare(password, `${existingUser.password}`);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials', 'signin() method error password');
    }
    let message = 'User login successfully';
    const token = authService.signToken(existingUser.id!, existingUser.email!, existingUser.username!);
    if (!token) {
      throw new BadRequestError('Error when signing token', 'signin() method error jwt');
    }
    res.status(StatusCodes.OK).json({
      message,
      accessToken: token,
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email
      }
    });
  }
}

export const authController = new AuthController();
