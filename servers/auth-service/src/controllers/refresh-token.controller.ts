import { DEFAULT_DEVICE } from '@auth/constants';
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
        deviceInfo: string;
      }
    >,
    res: Response
  ) {
    const { refreshToken, deviceInfo = DEFAULT_DEVICE } = req.body;
    const existingToken = await keyTokenService.findKeyToken({ refreshToken });
    if (!existingToken) throw new BadRequestError('Invalid refresh token', 'refreshAccessToken');

    if (deviceInfo && existingToken.deviceInfo !== deviceInfo) {
      throw new BadRequestError('Device mismatch', 'refreshAccessToken');
    }
    const { authId } = existingToken;
    await keyTokenService.deleteKeyToken({ refreshToken });
    const user = await authService.getAuthUserById(authId);
    if (!user) {
      throw new BadRequestError('User not found', 'refreshAccessToken');
    }
    const tokens = await keyTokenService.generateTokens(user, deviceInfo);
    new OkRequestSuccess('Refreshed tokens successfully', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }).send(res);
  }
}

export const refreshTokenController = new RefreshTokenController();
