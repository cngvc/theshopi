import { storeService } from '@gateway/services/api/store.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class StoreController {
  getStoreById = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.getStoreById(req.params.storeId);
    res.status(StatusCodes.OK).json({ message: response.data.message, store: response.data.store });
  };
  getStoreByUsername = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.getStoreByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, store: response.data.store });
  };
  getRandomStores = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.getRandomStores(req.params.size);
    res.status(StatusCodes.OK).json({ message: response.data.message, store: response.data.store });
  };
  createStore = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.createStore(req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, store: response.data.store });
  };
  updateStore = async (req: Request, res: Response) => {
    const response: AxiosResponse = await storeService.updateStore(req.params.storeId, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, store: response.data.store });
  };
}

export const storeController = new StoreController();
