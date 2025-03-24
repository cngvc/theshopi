import { DEFAULT_DEVICE } from '@auth/constants';
import { AppDataSource } from '@auth/database';
import { IKeyTokenDocument, KeyTokenModel } from '@auth/entities/key-token.entity';
import { generateKeyPair } from '@auth/utils/generate.util';
import { IAuthDocument, IAuthPayload, NotAuthorizedError } from '@cngvc/shopi-shared';
import { sign, verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';

class KeyTokenService {
  private keyTokenRepository: Repository<KeyTokenModel>;
  constructor() {
    this.keyTokenRepository = AppDataSource.getRepository(KeyTokenModel);
  }

  findKeyToken = async (params: Partial<IKeyTokenDocument>): Promise<IKeyTokenDocument | null> => {
    return await this.keyTokenRepository.findOne({ where: params });
  };

  findKeyTokens = async (params: Partial<IKeyTokenDocument>): Promise<IKeyTokenDocument[]> => {
    return await this.keyTokenRepository.find({ where: params });
  };

  deleteKeyToken = async (params: Partial<IKeyTokenDocument>) => {
    await this.keyTokenRepository.delete(params);
  };

  createKeyToken = async ({ authId, publicKey, privateKey, refreshToken, fingerprint }: IKeyTokenDocument): Promise<void> => {
    const keyToken = this.keyTokenRepository.create({
      authId,
      publicKey,
      privateKey,
      refreshToken,
      fingerprint
    });
    await this.keyTokenRepository.save(keyToken);
  };

  createTokenPair = ({ payload, publicKey, privateKey }: { payload: IAuthPayload; publicKey: string; privateKey: string }) => {
    try {
      const accessToken = sign(payload, privateKey, {
        expiresIn: '1d',
        algorithm: 'RS256'
      });
      const refreshToken = sign(payload, privateKey, {
        expiresIn: '7d',
        algorithm: 'RS256'
      });
      try {
        verify(accessToken, publicKey, { algorithms: ['RS256'] });
      } catch (err) {
        throw new NotAuthorizedError('Cannot create valid token pair', 'createTokenPair');
      }
      return { accessToken, refreshToken };
    } catch (error) {
      throw new NotAuthorizedError('Token generation failed', 'createTokenPair');
    }
  };

  generateTokens = async (user: IAuthDocument, fingerprint = DEFAULT_DEVICE) => {
    const { privateKey, publicKey } = generateKeyPair();
    const tokens = await keyTokenService.createTokenPair({
      payload: {
        id: user.id!,
        email: user.email!,
        username: user.username!
      },
      publicKey,
      privateKey
    });
    await this.createKeyToken({
      authId: user.id!,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
      fingerprint
    });
    return tokens;
  };
}

export const keyTokenService = new KeyTokenService();
