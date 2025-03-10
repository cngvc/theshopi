import { config } from '@auth/config';
import { AppDataSource } from '@auth/database';
import { AuthModel } from '@auth/entities/auth.entity';
import { authProducer } from '@auth/queues/auth.producer';
import { authCache } from '@auth/redis/auth-cache';
import { authChannel } from '@auth/server';
import { captureError } from '@auth/utils/logger.util';
import { ExchangeNames, IAuthDocument, lowerCase, RoutingKeys } from '@cngvc/shopi-shared';
import { sign } from 'jsonwebtoken';
import { MoreThan, Repository } from 'typeorm';

export class AuthService {
  private authRepository: Repository<AuthModel>;
  constructor() {
    this.authRepository = AppDataSource.getRepository(AuthModel);
  }
  async createAuthUser(data: IAuthDocument): Promise<IAuthDocument> {
    const user = this.authRepository.create(data);
    const createdUser = await this.authRepository.save(user);
    await authProducer.publishDirectMessage(
      authChannel,
      ExchangeNames.USERS_BUYER_UPDATE,
      RoutingKeys.USERS_BUYER_UPDATE,
      JSON.stringify({
        username: createdUser.username!,
        email: createdUser.email!,
        createdAt: createdUser.createdAt!,
        id: createdUser.id!,
        type: 'auth'
      })
    );
    return createdUser;
  }

  getAuthUserById(authId: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { id: authId } });
  }

  async checkUserExists(authId: string): Promise<boolean> {
    try {
      if (await authCache.getUserId(`user:${authId}`)) return true;
      const user = await this.authRepository.exists({ where: { id: authId } });
      if (!user) return false;
      await authCache.saveUserId(authId);

      return true;
    } catch (error) {
      captureError(error, 'checkUserExists');
      return false;
    }
  }

  async getAuthUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({
      where: [{ username: lowerCase(username ?? '') }, { email: lowerCase(email ?? '') }]
    });
  }

  async getAuthUserByEmail(email: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { email: lowerCase(email) }, select: ['id', 'username', 'email', 'password'] });
  }

  async getAuthUserByUsername(username: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { username: lowerCase(username) }, select: ['id', 'username', 'email', 'password'] });
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

  async updateVerifyEmailField(authId: string, emailVerified: boolean, emailVerificationToken?: string): Promise<boolean> {
    const result = await this.authRepository.update(authId, {
      emailVerified,
      emailVerificationToken
    });
    return !!result.affected && result?.affected > 0;
  }

  async updatePasswordToken(authId: string, token: string, tokenExpiration: Date): Promise<boolean> {
    const result = await this.authRepository.update(authId, {
      passwordResetToken: token,
      passwordResetExpires: tokenExpiration
    });
    return !!result.affected && result?.affected > 0;
  }

  async updatePassword(authId: string, password: string): Promise<boolean> {
    const result = await this.authRepository.update(authId, {
      password,
      passwordResetToken: undefined,
      passwordResetExpires: new Date()
    });
    return !!result.affected && result?.affected > 0;
  }

  signToken(id: string, email: string, username: string): string {
    return sign(
      {
        id,
        email,
        username
      },
      config.AUTH_JWT_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );
  }
}

export const authService = new AuthService();
