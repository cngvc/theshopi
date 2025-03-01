import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import axios, { AxiosResponse } from 'axios';

class BuyerService {
  axiosService: AxiosService;
  public axiosInstance: ReturnType<typeof axios.create>;

  constructor() {
    this.axiosService = new AxiosService(`${config.USERS_BASE_URL}/api/v1/buyer`, 'buyer');
    this.axiosInstance = this.axiosService.axios;
  }

  async getBuyerByEmail(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get('/email');
    return response;
  }

  async getCurrentBuyer(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get('/me');
    return response;
  }

  async getBuyerByUsername(username: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get(`/${username}`);
    return response;
  }
}

export const buyerService = new BuyerService();
