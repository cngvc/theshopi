import { productSeedController } from '@products/controllers/product-seed.controller';
import { productController } from '@products/controllers/product.controller';
import express, { Router } from 'express';

class ProductRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/:productId', productController.getProductById);
    this.router.get('/stores/:storeId', productController.getProductsByStore);
    this.router.post('/', productController.createProduct);
    this.router.put('/:productId', productController.updateProduct);
    this.router.put('/seed/:count', productSeedController.createdSeeds);
    return this.router;
  }
}

export const productRoutes = new ProductRoutes();
