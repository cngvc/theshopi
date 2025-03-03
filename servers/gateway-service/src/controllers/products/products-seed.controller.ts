import { productService } from '@gateway/services/api/product.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class ProductSeedController {
  async createSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.createSeeds(req.params.count as string);
    const { message } = response.data;
    res.status(StatusCodes.OK).json({ message });
  }
}

export const productSeedController = new ProductSeedController();
