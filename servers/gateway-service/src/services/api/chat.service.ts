import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios/axios.service';
import axios from 'axios';

class ChatService {
  axiosService: AxiosService;
  public axiosInstance: ReturnType<typeof axios.create>;

  constructor() {
    this.axiosService = new AxiosService(`${config.USERS_BASE_URL}/api/v1/chat`, 'buyer');
    this.axiosInstance = this.axiosService.axios;
  }
}

export const chatService = new ChatService();
