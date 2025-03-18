import { config } from '@auth/config';
import { AppDataSource } from '@auth/database';
import { AuthModel } from '@auth/entities/auth.entity';
import { IAuthPayload } from '@cngvc/shopi-shared';
import { IConversationParticipant } from '@cngvc/shopi-types/build/src/chat.interface';
import { verify } from 'jsonwebtoken';
import { In, Repository } from 'typeorm';

export class AuthGrpcService {
  private authRepository: Repository<AuthModel>;
  constructor() {
    this.authRepository = AppDataSource.getRepository(AuthModel);
  }
  async verifyUserByToken(token: string): Promise<IAuthPayload | null> {
    try {
      if (!token) return null;
      const payload = verify(token, `${config.AUTH_JWT_TOKEN_SECRET}`) as IAuthPayload;
      const user = await this.authRepository.exists({ where: { id: payload.id } });
      if (!user) return null;
      return payload;
    } catch (error) {
      return null;
    }
  }

  async findParticipantsByAuthIds(authIds: string[]): Promise<IConversationParticipant[]> {
    try {
      const users = await this.authRepository.find({
        where: {
          id: In(authIds)
        }
      });
      return users.map((e) => ({
        authId: e.id,
        username: e.username
      })) as IConversationParticipant[];
    } catch (error) {
      return [];
    }
  }
}

export const authGrpcService = new AuthGrpcService();
