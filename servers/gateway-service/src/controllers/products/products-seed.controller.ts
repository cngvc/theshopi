import { CreatedRequestSuccess } from '@cngvc/shopi-shared';
import { productService } from '@gateway/services/api/product.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class ProductSeedController {
  async createSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await productService.createSeeds(req.params.count as string);
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const productSeedController = new ProductSeedController();
