import { BadRequestError, IStoreProduct } from '@cngvc/shopi-shared';
import { productCreateSchema } from '@products/schemes/product.scheme';
import { productService } from '@products/services/product.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class ProductController {
  createProduct = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(productCreateSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'Create gig() method');
    }
    const product: IStoreProduct = {
      storeId: req.body.storeId,
      thumb: req.body.thumb,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity
    };
    const createdProduct = await productService.createProduct(product);
    res.status(StatusCodes.CREATED).json({ message: 'Gig created successfully.', product: createdProduct });
  };
}

export const productController = new ProductController();
