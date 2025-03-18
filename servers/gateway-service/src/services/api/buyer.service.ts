import { IShippingAddress } from '@cngvc/shopi-types';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class BuyerService extends AxiosService {
  constructor() {
    super(`${config.USERS_BASE_URL}/api/v1/buyer`, 'buyer');
  }

  async getCurrentBuyer(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get('/me');
    return response;
  }

  async updateBuyerAddress(payload: IShippingAddress): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/shipping-address`, payload);
    return response;
  }

  async updateBuyerPayment(payload: IShippingAddress): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/payment`, payload);
    return response;
  }
}

export const buyerService = new BuyerService();
