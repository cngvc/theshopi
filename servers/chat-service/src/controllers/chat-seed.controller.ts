import { chatProducer } from '@chat/queues/chat.producer';
import { chatChannel } from '@chat/server';
import { ExchangeNames, OkRequestSuccess, RoutingKeys } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class ChatSeedController {
  createdSeeds = async (req: Request, res: Response): Promise<void> => {
    await chatProducer.publishDirectMessage(
      chatChannel,
      ExchangeNames.GET_USERS,
      RoutingKeys.GET_USERS,
      JSON.stringify({
        count: req.params.count
      })
    );
    new OkRequestSuccess('Chat creating was handled by message queue.', {}).send(res);
  };
}

export const chatSeedController = new ChatSeedController();
