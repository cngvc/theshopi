import { IProductDocument } from '@cngvc/shopi-types';
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
  async updateProduct(productPublicId: string, payload: IProductDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/${productPublicId}`, payload);
    return response;
  }
  async getProductByProductPublicId(productPublicId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/${productPublicId}`);
    return response;
  }
  async getProductsByStorePublicId(storePublicId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/stores/${storePublicId}`);
    return response;
  }

  async getProducts(): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/`);
    return response;
  }

  async createSeeds(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/seed/${count}`);
    return response;
  }
}

export const productService = new ProductService();
