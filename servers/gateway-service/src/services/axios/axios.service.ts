import { GatewayToken } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { sign } from 'jsonwebtoken';

export class AxiosService {
  private axios: AxiosInstance;

  constructor(baseUrl: string, serviceName: GatewayToken) {
    this.axios = this.axiosCreateInstance(baseUrl, serviceName);
  }

  public setHeaderAuthorization(headerAuthorization: string): void {
    this.axios.defaults.headers['Authorization'] = headerAuthorization;
  }

  protected async get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.axios.get<T>(url);
  }

  protected async post<T>(url: string, data?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.axios.post<T>(url, data);
  }

  protected async put<T>(url: string, data?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.axios.put<T>(url, data);
  }

  protected async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.axios.delete<T>(url);
  }

  private axiosCreateInstance(baseUrl: string, serviceName?: GatewayToken): ReturnType<typeof axios.create> {
    let requestGatewayToken = '';
    if (serviceName) {
      requestGatewayToken = sign({ id: serviceName }, `${config.GATEWAY_JWT_TOKEN_SECRET}`);
    }
    const instance: ReturnType<typeof axios.create> = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'gateway-token': requestGatewayToken
      },
      withCredentials: true
    });
    return instance;
  }
}
