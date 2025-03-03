import { BadRequestError, IStoreProduct } from '@cngvc/shopi-shared';
import { productCreateSchema, productUpdateSchema } from '@products/schemes/product.scheme';
import { productService } from '@products/services/product.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class ProductController {
  createProduct = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(productCreateSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createProduct() method');
    }
    const product: IStoreProduct = {
      storeId: req.body.storeId,
      thumb: req.body.thumb,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity ?? 0,
      isPublished: !!req.body.isPublished
    };
    const createdProduct = await productService.createProduct(product);
    res.status(StatusCodes.CREATED).json({ message: 'Product has been created successfully.', product: createdProduct });
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(productUpdateSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createProduct() method');
    }
    const product: IStoreProduct = {
      thumb: req.body.thumb,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity ?? 0,
      isPublished: !!req.body.isPublished
    };
    const updatedProduct = await productService.updateProduct(req.params.productId, product);
    res.status(StatusCodes.CREATED).json({ message: 'Product has been updated successfully.', product: updatedProduct });
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    const product = await productService.getProductById(req.params.productId);
    res.status(StatusCodes.OK).json({ message: 'Get product by id', product });
  };

  getProductsByStore = async (req: Request, res: Response): Promise<void> => {
    const products: IStoreProduct[] = await productService.getStoreProducts(req.params.storeId);
    res.status(StatusCodes.OK).json({ message: 'Get store products', products });
  };
}

export const productController = new ProductController();
