import { storeSeedController } from '@user/controllers/store-seed.controller';
import { storeController } from '@user/controllers/store.controller';
import express, { Router } from 'express';

class StoreRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/id/:storePublicId', storeController.getStoreByStorePublicId);
    this.router.get('/username/:username', storeController.getStoreByUsername);
    this.router.get('/random/:size', storeController.getRandomStores);
    this.router.put('/:storePublicId', storeController.updateStore);
    this.router.put('/seed/:count', storeSeedController.createSeeds);
    this.router.post('/', storeController.createStore);

    return this.router;
  }
}

export const storeRoutes = new StoreRoutes();
