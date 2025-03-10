import { AuthMiddleware } from '@cngvc/shopi-shared';
import { storeController } from '@gateway/controllers/users/store.controller';
import express, { Router } from 'express';

class StoreRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.use(AuthMiddleware.checkAuthentication);
    this.router.get('/store/:storePublicId', storeController.getStoreByStorePublicId);
    this.router.get('/store/username/:username', storeController.getStoreByUsername);
    this.router.get('/store/random/:size', storeController.getRandomStores);
    this.router.post('/store', storeController.createStore);
    this.router.put('/store/:storePublicId', storeController.updateStore);

    return this.router;
  }
}

export const storeRoutes: StoreRoutes = new StoreRoutes();
