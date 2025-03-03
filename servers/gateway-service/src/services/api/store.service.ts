import { IStoreDocument } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import axios, { AxiosResponse } from 'axios';

class StoreService {
  axiosService: AxiosService;
  public axiosInstance: ReturnType<typeof axios.create>;

  constructor() {
    this.axiosService = new AxiosService(`${config.USERS_BASE_URL}/api/v1/store`, 'store');
    this.axiosInstance = this.axiosService.axios;
  }

  async getStoreById(storeId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get(`/${storeId}`);
    return response;
  }

  async getStoreByUsername(username: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get(`/username/${username}`);
    return response;
  }

  async getRandomStores(size: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.get(`/random/${size}`);
    return response;
  }

  async createStore(body: IStoreDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.post('/', body);
    return response;
  }

  async updateStore(storeId: string, body: IStoreDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.put(`/${storeId}`, body);
    return response;
  }

  async createSeeds(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosInstance.put(`/seed/${count}`);
    return response;
  }
}

export const storeService = new StoreService();
