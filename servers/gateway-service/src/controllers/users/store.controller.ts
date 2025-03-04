import { CreatedRequestSuccess, OkRequestSuccess } from '@cngvc/shopi-shared';
import { storeService } from '@gateway/services/api/store.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class StoreController {
  getStoreById = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.getStoreById(req.params.storeId);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  getStoreByUsername = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.getStoreByUsername(req.params.username);
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
    const response: AxiosResponse = await storeService.updateStore(req.params.storeId, req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
}

export const storeController = new StoreController();
