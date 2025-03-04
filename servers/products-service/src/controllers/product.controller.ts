import { BadRequestError, CreatedRequestSuccess, IProductDocument, OkRequestSuccess } from '@cngvc/shopi-shared';
import { productCreateSchema, productUpdateSchema } from '@products/schemes/product.scheme';
import { productService } from '@products/services/product.service';
import { Request, Response } from 'express';

class ProductController {
  createProduct = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(productCreateSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createProduct() method');
    }
    const product: IProductDocument = {
      storeId: req.body.storeId,
      thumb: req.body.thumb,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity ?? 0,
      isPublished: !!req.body.isPublished,
      categories: req.body.categories,
      tags: req.body.tags
    };
    const createdProduct = await productService.createProduct(product);
    new CreatedRequestSuccess('Product has been created successfully.', { product: createdProduct }).send(res);
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(productUpdateSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createProduct() method');
    }
    const product: IProductDocument = {
      thumb: req.body.thumb,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity ?? 0,
      isPublished: !!req.body.isPublished,
      categories: req.body.categories,
      tags: req.body.tags
    };
    const updatedProduct = await productService.updateProduct(req.params.productId, product);
    new OkRequestSuccess('Product has been updated successfully.', { product: updatedProduct }).send(res);
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    const product = await productService.getProductById(req.params.productId);
    new OkRequestSuccess('Get product by id.', { product }).send(res);
  };

  getProductsByStore = async (req: Request, res: Response): Promise<void> => {
    const products: IProductDocument[] = await productService.getStoreProducts(req.params.storeId);
    new OkRequestSuccess('Get store products.', { products }).send(res);
  };
}

export const productController = new ProductController();
