import { CreatedRequestSuccess, OkRequestSuccess } from '@cngvc/shopi-shared';
import { storeService } from '@gateway/services/api/store.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class StoreController {
  getStoreByStorePublicId = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.getStoreByStorePublicId(req.params.storePublicId);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  getRandomStores = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.getRandomStores(req.params.size);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  createStore = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.createStore(req.body);
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  updateStore = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.updateStore(req.params.storePublicId, req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
}

export const storeController = new StoreController();
