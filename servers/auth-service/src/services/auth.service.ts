import { config } from '@auth/config';
import { AppDataSource } from '@auth/database';
import { AuthModel } from '@auth/entities/auth.entity';
import { authProducer } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { ExchangeNames, IAuthBuyerMessageDetails, IAuthDocument, lowerCase, RoutingKeys } from '@cngvc/shopi-shared';
import { sign } from 'jsonwebtoken';
import { MoreThan, Repository } from 'typeorm';

export class AuthService {
  private authRepository: Repository<AuthModel>;
  constructor() {
    this.authRepository = AppDataSource.getRepository(AuthModel);
  }
  async createAuthUser(data: IAuthDocument): Promise<IAuthDocument> {
    const user = this.authRepository.create(data);
    await authProducer.publishDirectMessage(
      authChannel,
      ExchangeNames.USERS_BUYER_UPDATE,
      RoutingKeys.USERS_BUYER_UPDATE,
      JSON.stringify({
        username: user.username!,
        email: user.email!,
        createdAt: user.createdAt!,
        type: 'auth'
      } as IAuthBuyerMessageDetails),
      'Buyer details sent to buyer service.'
    );
    return await this.authRepository.save(user);
  }

  async getAuthUserById(authId: number): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { id: authId } });
  }

  async getAuthUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({
      where: [{ username: lowerCase(username ?? '') }, { email: lowerCase(email ?? '') }]
    });
  }

  async getAuthUserByEmail(email: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { email: lowerCase(email) } });
  }

  async getAuthUserByUsername(username: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { username: lowerCase(username) } });
  }

  async getAuthUserByVerificationToken(token: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { emailVerificationToken: token } });
  }

  async getAuthUserByPasswordResetToken(token: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date())
      }
    });
  }

  async updateVerifyEmailField(authId: number, emailVerified: boolean, emailVerificationToken?: string): Promise<boolean> {
    const result = await this.authRepository.update(authId, {
      emailVerified,
      emailVerificationToken
    });
    return !!result.affected && result?.affected > 0;
  }

  async updatePasswordToken(authId: number, token: string, tokenExpiration: Date): Promise<boolean> {
    const result = await this.authRepository.update(authId, {
      passwordResetToken: token,
      passwordResetExpires: tokenExpiration
    });
    return !!result.affected && result?.affected > 0;
  }

  async updatePassword(authId: number, password: string): Promise<boolean> {
    const result = await this.authRepository.update(authId, {
      password,
      passwordResetToken: undefined,
      passwordResetExpires: new Date()
    });
    return !!result.affected && result?.affected > 0;
  }

  signToken(id: number, email: string, username: string): string {
    return sign(
      {
        id,
        email,
        username
      },
      config.AUTH_JWT_TOKEN_SECRET!
    );
  }
}

export const authService = new AuthService();
