import { AuthMiddleware } from '@cngvc/shopi-shared';
import { storeController } from '@gateway/controllers/users/store.controller';
import express, { Router } from 'express';

class StoreRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/store/:storeId', AuthMiddleware.checkAuthentication, storeController.getStoreById);
    this.router.get('/store/username/:username', AuthMiddleware.checkAuthentication, storeController.getStoreByUsername);
    this.router.get('/store/random/:size', AuthMiddleware.checkAuthentication, storeController.getRandomStores);
    this.router.post('/store', AuthMiddleware.checkAuthentication, storeController.createStore);
    this.router.put('/store/:storeId', AuthMiddleware.checkAuthentication, storeController.updateStore);

    return this.router;
  }
}

export const storeRoutes: StoreRoutes = new StoreRoutes();
