import { productController } from '@gateway/controllers/product/product.controller';
import express, { Router } from 'express';

class ProductPublicRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/products/', productController.getProducts);
    this.router.get('/products/:productPublicId/more-like-this', productController.getMoreProductsLikeThis);
    this.router.get('/products/:productPublicId', productController.getProductByProductPublicId);
    this.router.get('/products/stores/:storePublicId', productController.getProductsByStorePublicId);

    return this.router;
  }
}

export const productPublicRoutes = new ProductPublicRoutes();
