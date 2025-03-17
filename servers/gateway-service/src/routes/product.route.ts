import { productController } from '@gateway/controllers/product/product.controller';
import express, { Router } from 'express';

class ProductRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/products/', productController.createProduct);
    this.router.put('/products/:productPublicId', productController.updateProduct);

    return this.router;
  }
}

export const productRoutes = new ProductRoutes();
