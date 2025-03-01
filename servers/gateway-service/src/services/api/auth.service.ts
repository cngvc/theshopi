import { IAuth } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import axios, { AxiosResponse } from 'axios';

class AuthService {
  axiosService: AxiosService;
  public axiosInstance: ReturnType<typeof axios.create>;

  constructor() {
    this.axiosService = new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`, 'auth');
    this.axiosInstance = this.axiosService.axios;
  }

  async getCurrentUser(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get('/me');
    return response;
  }

  async getRefreshToken(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get('/refresh-token');
    return response;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response: AxiosResponse = await this.axiosInstance.put('/change-password', {
      currentPassword,
      newPassword
    });
    return response;
  }

  async signup(payload: IAuth) {
    const response: AxiosResponse = await this.axiosInstance.post('/signup', payload);
    return response;
  }

  async signin(payload: IAuth) {
    const response: AxiosResponse = await this.axiosInstance.post('/signin', payload);
    return response;
  }

  async verifyEmail(token: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.put(`/verify-email?token=${token}`);
    return response;
  }

  async resendEmail() {
    const response: AxiosResponse = await this.axiosInstance.post('/resend-email');
    return response;
  }

  async forgotPassword(email: string) {
    const response: AxiosResponse = await this.axiosInstance.put('/forgot-password', { email });
    return response;
  }

  async resetPassword(token: string, password: string, confirmPassword: string) {
    const response: AxiosResponse = await this.axiosInstance.put(`/reset-password/${token}`, { password, confirmPassword });
    return response;
  }

  async createSeeds(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.put(`/seed/${count}`);
    return response;
  }
}

export const authService = new AuthService();
