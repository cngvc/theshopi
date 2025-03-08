import { productController } from '@gateway/controllers/product/product.controller';
import express, { Router } from 'express';

class ProductPublicRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/products/', productController.getProducts);
    this.router.get('/products/:identifier', productController.getProductByIdentifier);
    this.router.get('/products/stores/:storePublicId', productController.getProductsByStore);

    return this.router;
  }
}

export const productPublicRoutes = new ProductPublicRoutes();
