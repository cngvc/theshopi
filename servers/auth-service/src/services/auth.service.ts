import { config } from '@auth/config';
import { AppDataSource } from '@auth/database';
import { AuthModel } from '@auth/entities/auth.entity';
import { log } from '@auth/utils/logger.util';
import { getErrorMessage, IAuthDocument, lowerCase } from '@cngvc/shopi-shared';
import { sign } from 'jsonwebtoken';
import { MoreThan, Repository } from 'typeorm';

export class AuthService {
  private authRepository: Repository<AuthModel>;
  constructor() {
    this.authRepository = AppDataSource.getRepository(AuthModel);
  }
  async createAuthUser(data: IAuthDocument): Promise<IAuthDocument> {
    try {
      const user = this.authRepository.create(data);
      await this.authRepository.save(user);
      return user;
    } catch (error) {
      log.error(getErrorMessage(error));
      throw new Error('Error creating auth user');
    }
  }

  async getAuthUserById(authId: number): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { id: authId } }) || null;
  }

  async getAuthUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | null> {
    return (
      this.authRepository.findOne({
        where: [{ username: lowerCase(username ?? '') }, { email: lowerCase(email ?? '') }]
      }) || null
    );
  }

  async getAuthUserByEmail(email: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { email: lowerCase(email) } }) || null;
  }

  async getAuthUserByUsername(username: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { username: lowerCase(username) } }) || null;
  }

  async getAuthUserByVerificationToken(token: string): Promise<IAuthDocument | null> {
    return this.authRepository.findOne({ where: { emailVerificationToken: token } }) || null;
  }

  async getAuthUserByPasswordResetToken(token: string): Promise<IAuthDocument | null> {
    return (
      this.authRepository.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpires: MoreThan(new Date())
        }
      }) || null
    );
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

  signToken(id: number, email: string, username: string): string | null {
    try {
      return sign({ id, email, username }, `${config.AUTH_JWT_TOKEN_SECRET}`);
    } catch (error) {
      log.error(getErrorMessage(error));
      return null;
    }
  }
}

export const authService = new AuthService();
