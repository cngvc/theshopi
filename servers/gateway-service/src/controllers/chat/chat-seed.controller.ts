import { CreatedRequestSuccess } from '@cngvc/shopi-shared';
import { chatService } from '@gateway/services/api/chat.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class ChatSeedController {
  async createSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatService.createSeeds(req.params.count as string);
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const chatSeedController = new ChatSeedController();
