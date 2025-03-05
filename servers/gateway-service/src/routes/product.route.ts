import { AuthMiddleware } from '@cngvc/shopi-shared';
import { productController } from '@gateway/controllers/products/products.controller';
import express, { Router } from 'express';

class ProductRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/products/', AuthMiddleware.checkAuthentication, productController.createProduct);
    this.router.put('/products/:productId', AuthMiddleware.checkAuthentication, productController.updateProduct);
    this.router.get('/products/:productId', AuthMiddleware.checkAuthentication, productController.getProductById);
    this.router.get('/products/stores/:storeId', AuthMiddleware.checkAuthentication, productController.getProductsByStore);
    return this.router;
  }
}

export const productRoutes = new ProductRoutes();
