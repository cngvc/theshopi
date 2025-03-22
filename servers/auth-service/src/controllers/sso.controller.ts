import { config } from '@auth/config';
import { USER_PROVIDER } from '@auth/constants';
import { authService } from '@auth/services/auth.service';
import { keyTokenService } from '@auth/services/key-token.service';
import { userProviderService } from '@auth/services/user-provider.service';
import { BadRequestError, IAuthDocument, lowerCase, OkRequestSuccess, ServerError } from '@cngvc/shopi-shared';
import axios from 'axios';
import * as crypto from 'crypto';
import { Request, Response } from 'express';

const GITHUB_URL = 'https://github.com';
const API_GITHUB_URL = 'https://api.github.com';

class SSOController {
  constructor() {}

  githubLogin = (req: Request, res: Response) => {
    const githubAuthUrl = `${GITHUB_URL}/login/oauth/authorize?client_id=${config.GITHUB_CLIENT_ID}&scope=user:email`;
    new OkRequestSuccess('SSO Github', {
      authUrl: githubAuthUrl
    }).send(res);
  };

  githubCallback = async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) {
      throw new BadRequestError('No code provided', 'githubCallback');
    }
    try {
      const tokenResponse = await axios.post(
        `${GITHUB_URL}/login/oauth/access_token`,
        {
          client_id: config.GITHUB_CLIENT_ID,
          client_secret: config.GITHUB_CLIENT_SECRET,
          code: code
        },
        {
          headers: { Accept: 'application/json' }
        }
      );
      const accessToken = tokenResponse.data.access_token;
      const userResponse = await axios.get(`${API_GITHUB_URL}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const emailResponse = await axios.get(`${API_GITHUB_URL}/user/emails`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const primaryEmail = emailResponse.data.find((email: any) => email.primary)?.email || '';

      const githubUser = {
        id: userResponse.data.id,
        email: primaryEmail,
        username: userResponse.data.login
      };

      let userProvider = await userProviderService.findUserProvider({
        provider: USER_PROVIDER.github,
        providerId: githubUser.id
      });
      let user = await authService.getAuthUserByUsernameOrEmail(githubUser.email);
      if (!userProvider) {
        if (!user) {
          const authData: IAuthDocument = {
            username: lowerCase(githubUser.username),
            email: lowerCase(githubUser.email),
            password: crypto.randomBytes(16).toString('hex'),
            emailVerified: true
          };
          user = await authService.createAuthUser(authData);
        }
        await userProviderService.createUserProvider({
          provider: USER_PROVIDER.github,
          providerId: githubUser.id,
          user: user
        });
      }
      await keyTokenService.deleteKeyToken({ authId: user!.id });
      const tokens = await keyTokenService.generateTokens(user!);
      new OkRequestSuccess('SSO Github Callback', {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }).send(res);
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      throw new ServerError('SSO Github Callback', 'githubCallback');
    }
  };
}

export const ssoController = new SSOController();
