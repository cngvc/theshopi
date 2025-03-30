import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import { AxiosResponse } from 'axios';

class BalanceService extends AxiosService {
  constructor() {
    super(`${config.BALANCE_BASE_URL}/api/v1/balance`, 'balance');
  }
  getCurrentUserBalance = async () => {
    const response: AxiosResponse = await this.get('/');
    return response;
  };
  depositBalance = async (payload: { amount: number }) => {
    const response: AxiosResponse = await this.post('/deposit', payload);
    return response;
  };
  withdrawBalance = async (payload: { amount: number }) => {
    const response: AxiosResponse = await this.post('/withdraw', payload);
    return response;
  };
  transferBalance = async (payload: { amount: number; toAuthId: string }) => {
    const response: AxiosResponse = await this.post('/transfer', payload);
    return response;
  };

  createSeeds = async (count: string): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.put(`/seed/${count}`);
    return response;
  };
}

export const balanceService = new BalanceService();
