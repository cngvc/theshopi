import { BadRequestError, CreatedRequestSuccess, getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { IProductDocument, IStoreDocument, productCreateSchema, productUpdateSchema } from '@cngvc/shopi-types';
import { DefaultSearchQuery } from '@product/constants';
import { productService } from '@product/services/product.service';
import { searchService } from '@product/services/search.service';
import { Request, Response } from 'express';

class ProductController {
  createProduct = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(productCreateSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createProduct');
    }
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const storePublicId = await this.checkIfUserIsStore(currentUser.id);
    const product: IProductDocument = {
      storePublicId: storePublicId,
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
      throw new BadRequestError(error.details[0].message, 'updateProduct');
    }
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const storePublicId = await this.checkIfUserIsStore(currentUser.id);
    const product: IProductDocument = {
      storePublicId: storePublicId,
      thumb: req.body.thumb,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity ?? 0,
      isPublished: !!req.body.isPublished,
      categories: req.body.categories,
      tags: req.body.tags
    };
    const updatedProduct = await productService.updateProduct(req.params.productPublicId, product);
    new OkRequestSuccess('Product has been updated successfully.', { product: updatedProduct }).send(res);
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    const { query, min_price, max_price, from, size, type } = req.query;
    const products = await productService.getProducts(
      `${query || ''}`,
      { from: parseInt(`${from || DefaultSearchQuery.from}`), size: parseInt(`${size || DefaultSearchQuery.size}`, 10) },
      parseInt(`${min_price}`, 10),
      parseInt(`${max_price}`, 10)
    );
    new OkRequestSuccess('Get products.', { products }).send(res);
  };

  getProductByProductPublicId = async (req: Request, res: Response): Promise<void> => {
    const product = await productService.getProductByProductPublicId(req.params.productPublicId);
    new OkRequestSuccess('Get product by id.', { product }).send(res);
  };

  getProductsByStorePublicId = async (req: Request, res: Response): Promise<void> => {
    const products: IProductDocument[] = await productService.getStoreProducts(req.params.storePublicId);
    new OkRequestSuccess('Get store products.', { products }).send(res);
  };

  private checkIfUserIsStore = async (authId: string): Promise<string> => {
    const storePublicId = ((await searchService.searchStoreByAuthId(authId)) as IStoreDocument | null)?.ownerAuthId;
    if (!storePublicId) {
      throw new BadRequestError('Store not found or you are not store user', 'createProduct');
    }
    return storePublicId;
  };
}

export const productController = new ProductController();
