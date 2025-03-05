import { IProductDocument } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class ProductService extends AxiosService {
  constructor() {
    super(`${config.PRODUCTS_BASE_URL}/api/v1/products`, 'product');
  }
  async createProduct(body: IProductDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.post(`/`, body);
    return response;
  }
  async updateProduct(productId: string, payload: IProductDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/${productId}`, payload);
    return response;
  }
  async getProductById(productId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/${productId}`);
    return response;
  }
  async getProductsByStore(storeId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/stores/${storeId}`);
    return response;
  }

  async createSeeds(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/seed/${count}`);
    return response;
  }
}

export const productService = new ProductService();
