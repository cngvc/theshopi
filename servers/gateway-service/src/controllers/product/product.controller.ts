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
    const response: AxiosResponse = await productService.updateProduct(req.params.productPublicId, req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
  async getProducts(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.getProducts();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
  async getProductByProductPublicId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.getProductByProductPublicId(req.params.productPublicId);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
  async getProductsByStorePublicId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.getProductsByStorePublicId(req.params.storePublicId);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const productController = new ProductController();
