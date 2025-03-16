import { ICartItem } from '@cngvc/shopi-types';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class CartService extends AxiosService {
  constructor() {
    super(`${config.CART_BASE_URL}/api/v1/cart`, 'cart');
  }
  getCart = async () => {
    const response: AxiosResponse = await this.get('/');
    return response;
  };
  addToCart = async (payload: ICartItem) => {
    const response: AxiosResponse = await this.post('/', payload);
    return response;
  };
  updateCart = async (payload: ICartItem) => {
    const response: AxiosResponse = await this.put('/', payload);
    return response;
  };
  increaseItemInCart = async (payload: ICartItem) => {
    const response: AxiosResponse = await this.put('/increase', payload);
    return response;
  };
  decreaseItemInCart = async (payload: ICartItem) => {
    const response: AxiosResponse = await this.put('/decrease', payload);
    return response;
  };
  removeItemInCart = async (payload: ICartItem) => {
    const response: AxiosResponse = await this.put('/remove-item', payload);
    return response;
  };
}

export const cartService = new CartService();
