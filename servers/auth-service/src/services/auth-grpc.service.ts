import { DEFAULT_DEVICE } from '@auth/constants';
import { AppDataSource } from '@auth/database';
import { AuthModel } from '@auth/entities/auth.entity';
import { IAuthPayload, NotAuthorizedError } from '@cngvc/shopi-shared';
import { IConversationParticipant } from '@cngvc/shopi-types/build/src/chat.interface';
import { decode, verify } from 'jsonwebtoken';
import { In, Repository } from 'typeorm';
import { keyTokenService } from './key-token.service';

export class AuthGrpcService {
  private authRepository: Repository<AuthModel>;
  constructor() {
    this.authRepository = AppDataSource.getRepository(AuthModel);
  }

  // this function is called from gateway service each request.
  async verifyUserByToken(token: string, deviceInfo = DEFAULT_DEVICE): Promise<IAuthPayload | null> {
    try {
      if (!token) return null;
      const tokenPayload = decode(token) as IAuthPayload;
      const keyToken = await keyTokenService.findKeyToken({
        authId: tokenPayload.id,
        deviceInfo
      });
      if (!keyToken || !keyToken.publicKey) {
        throw new NotAuthorizedError('Public key not found', 'verifyAccessToken');
      }
      const payload = verify(token, keyToken.publicKey) as IAuthPayload;
      if (!(await this.authRepository.exists({ where: { id: payload.id } }))) return null;
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
