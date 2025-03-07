import { AuthMiddleware } from '@cngvc/shopi-shared';
import { productController } from '@gateway/controllers/products/products.controller';
import express, { Router } from 'express';

class ProductRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/products/', productController.getProducts);
    this.router.get('/products/:productId', productController.getProductById);
    this.router.get('/products/stores/:storeId', productController.getProductsByStore);

    this.router.post('/products/', AuthMiddleware.checkAuthentication, productController.createProduct);
    this.router.put('/products/:productId', AuthMiddleware.checkAuthentication, productController.updateProduct);

    return this.router;
  }
}

export const productRoutes = new ProductRoutes();
