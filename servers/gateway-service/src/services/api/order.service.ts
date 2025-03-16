import { IOrderDocument } from '@cngvc/shopi-types';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class OrderService extends AxiosService {
  constructor() {
    super(`${config.ORDER_BASE_URL}/api/v1/orders`, 'order');
  }
  createOrder = async (payload: IOrderDocument) => {
    const response: AxiosResponse = await this.post('/', payload);
    return response;
  };
}

export const orderService = new OrderService();
