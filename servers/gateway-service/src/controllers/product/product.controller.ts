import { CreatedRequestSuccess, OkRequestSuccess } from '@cngvc/shopi-shared';
import { productService } from '@gateway/services/api/product.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.createProduct(req.body);
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
  async updateProduct(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.updateProduct(req.params.productId, req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
  async getProducts(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.getProducts();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
  async getProductByIdentifier(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.getProductByIdentifier(req.params.identifier);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
  async getProductsByStore(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.getProductsByStore(req.params.storeId);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const productController = new ProductController();
