import { IAuth } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class AuthService extends AxiosService {
  constructor() {
    super(`${config.AUTH_BASE_URL}/api/v1/auth`, 'auth');
  }

  async getCurrentUser(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get('/me');
    return response;
  }

  async refreshAccessToken(refreshToken: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.post('/refresh-token', {
      refreshToken
    });
    return response;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response: AxiosResponse = await this.put('/change-password', {
      currentPassword,
      newPassword
    });
    return response;
  }

  async signup(payload: IAuth) {
    const response: AxiosResponse = await this.post('/signup', payload);
    return response;
  }

  async signin(payload: IAuth) {
    const response: AxiosResponse = await this.post('/signin', payload);
    return response;
  }

  async verifyEmail(token: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/verify-email?token=${token}`);
    return response;
  }

  async resendEmail() {
    const response: AxiosResponse = await this.post('/resend-email');
    return response;
  }

  async forgotPassword(email: string) {
    const response: AxiosResponse = await this.put('/forgot-password', { email });
    return response;
  }

  async resetPassword(token: string, password: string, confirmPassword: string) {
    const response: AxiosResponse = await this.put(`/reset-password/${token}`, { password, confirmPassword });
    return response;
  }

  async createSeeds(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/seed/${count}`);
    return response;
  }

  async github() {
    const response: AxiosResponse = await this.get('/github');
    return response;
  }

  async githubCallback(params: Record<string, string>) {
    const response: AxiosResponse = await this.get('/github/callback', params);
    return response;
  }
}

export const authService = new AuthService();
