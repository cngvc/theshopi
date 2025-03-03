import { productService } from '@gateway/services/api/product.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.createProduct(req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, product: response.data.product });
  }
  async updateProduct(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.updateProduct(req.params.productId, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, product: response.data.product });
  }
  async getProductById(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.getProductById(req.params.productId);
    res.status(StatusCodes.OK).json({ message: response.data.message, product: response.data.product });
  }
  async getProductsByStore(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.getProductsByStore(req.params.storeId);
    res.status(StatusCodes.OK).json({ message: response.data.message, products: response.data.products });
  }
}

export const productController = new ProductController();
