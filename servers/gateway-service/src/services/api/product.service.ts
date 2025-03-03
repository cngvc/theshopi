import { IStoreProduct } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import axios, { AxiosResponse } from 'axios';

class ProductService {
  axiosService: AxiosService;
  public axiosInstance: ReturnType<typeof axios.create>;

  constructor() {
    this.axiosService = new AxiosService(`${config.PRODUCTS_BASE_URL}/api/v1/products`, 'product');
    this.axiosInstance = this.axiosService.axios;
  }
  async createProduct(body: IStoreProduct): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.post(`/`, body);
    return response;
  }
  async updateProduct(productId: string, body: IStoreProduct): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.put(`/${productId}`, body);
    return response;
  }
  async getProductById(productId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get(`/${productId}`);
    return response;
  }
  async getProductsByStore(storeId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get(`/stores/${storeId}`);
    return response;
  }

  async createSeeds(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.put(`/seed/${count}`);
    return response;
  }
}

export const productService = new ProductService();
