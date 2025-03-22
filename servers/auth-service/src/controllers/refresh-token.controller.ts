import { authService } from '@auth/services/auth.service';
import { keyTokenService } from '@auth/services/key-token.service';
import { BadRequestError, OkRequestSuccess } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class RefreshTokenController {
  async refreshAccessToken(
    req: Request<
      {},
      {},
      {
        refreshToken: string;
      }
    >,
    res: Response
  ) {
    const fingerprint = req.headers['x-device-fingerprint'] as string;

    const { refreshToken } = req.body;
    const existingToken = await keyTokenService.findKeyToken({ refreshToken });
    if (!existingToken) throw new BadRequestError('Invalid refresh token', 'refreshAccessToken');

    if (fingerprint && existingToken.fingerprint !== fingerprint) {
      throw new BadRequestError('Device mismatch', 'refreshAccessToken');
    }
    const { authId } = existingToken;
    const user = await authService.getAuthUserById(authId);
    if (!user) {
      throw new BadRequestError('User not found', 'refreshAccessToken');
    }
    await keyTokenService.deleteKeyToken({ refreshToken });
    const tokens = await keyTokenService.generateTokens(user, fingerprint);
    new OkRequestSuccess('Refreshed tokens successfully', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }).send(res);
  }
}

export const refreshTokenController = new RefreshTokenController();
