import { IStoreDocument } from '@cngvc/shopi-shared-types';
import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class StoreService extends AxiosService {
  constructor() {
    super(`${config.USERS_BASE_URL}/api/v1/store`, 'store');
  }

  async getStoreByStorePublicId(storePublicId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/${storePublicId}`);
    return response;
  }

  async getStoreByUsername(username: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/username/${username}`);
    return response;
  }

  async getRandomStores(size: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.get(`/random/${size}`);
    return response;
  }

  async createStore(body: IStoreDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.post('/', body);
    return response;
  }

  async updateStore(storePublicId: string, body: IStoreDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/${storePublicId}`, body);
    return response;
  }

  async createSeeds(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.put(`/seed/${count}`);
    return response;
  }
}

export const storeService = new StoreService();
