import { storeController } from '@gateway/controllers/users/store.controller';
import { authMiddleware } from '@gateway/middlewares/auth.middleware';
import express, { Router } from 'express';

class StoreRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/store/id/:storeId', authMiddleware.checkAuthentication, storeController.getStoreById);
    this.router.get('/store/username/:username', authMiddleware.checkAuthentication, storeController.getStoreByUsername);
    this.router.get('/store/random/:size', authMiddleware.checkAuthentication, storeController.getRandomStores);
    this.router.post('store/create', authMiddleware.checkAuthentication, storeController.createStore);
    this.router.put('/store/:storeId', authMiddleware.checkAuthentication, storeController.updateStore);
    this.router.put('/store/seed/:count', authMiddleware.checkAuthentication, storeController.createSeeds);

    return this.router;
  }
}

export const storeRoutes: StoreRoutes = new StoreRoutes();
