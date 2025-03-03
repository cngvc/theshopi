import { productController } from '@gateway/controllers/products/products.controller';
import { authMiddleware } from '@gateway/middlewares/auth.middleware';
import express, { Router } from 'express';

class ProductRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/products/', authMiddleware.checkAuthentication, productController.createProduct);
    this.router.put('/products/:productId', authMiddleware.checkAuthentication, productController.updateProduct);
    this.router.get('/products/:productId', authMiddleware.checkAuthentication, productController.getProductById);
    this.router.get('/products/stores/:storeId', authMiddleware.checkAuthentication, productController.getProductsByStore);
    return this.router;
  }
}

export const productRoutes = new ProductRoutes();
