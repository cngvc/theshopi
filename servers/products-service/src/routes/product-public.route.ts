import { productController } from '@product/controllers/product.controller';
import express, { Router } from 'express';

class ProductPublicRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/', productController.getProducts);
    this.router.get('/:productPublicId/more-like-this', productController.getMoreProductsLikeThis);
    this.router.get('/:productPublicId', productController.getProductByProductPublicId);
    this.router.get('/stores/:storePublicId', productController.getProductsByStorePublicId);
    return this.router;
  }
}

export const productPublicRoutes = new ProductPublicRoutes();
