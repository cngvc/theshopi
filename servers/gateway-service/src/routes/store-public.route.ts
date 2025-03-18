import { storeController } from '@gateway/controllers/users/store.controller';
import express, { Router } from 'express';

class StorePublicRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/store/:storePublicId', storeController.getStoreByStorePublicId);
    return this.router;
  }
}

export const storePublicRoutes = new StorePublicRoutes();
