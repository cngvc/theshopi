import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class BuyerService extends AxiosService {
  constructor() {
    super(`${config.USERS_BASE_URL}/api/v1/buyer`, 'buyer');
  }

  async getBuyerByEmail(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get('/email');
    return response;
  }

  async getCurrentBuyer(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get('/me');
    return response;
  }

  async getBuyerByUsername(username: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/${username}`);
    return response;
  }
}

export const buyerService = new BuyerService();
