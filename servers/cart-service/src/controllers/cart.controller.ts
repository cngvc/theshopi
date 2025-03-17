import { cartService } from '@cart/services/cart.service';
import { getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { ICartItem } from '@cngvc/shopi-types';
import { Request, Response } from 'express';

class CartController {
  getCart = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const cart = await cartService.getCart(currentUser.id);
    new OkRequestSuccess('Cart items', { cart }).send(res);
  };
  addToCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    await cartService.addToCart(currentUser.id, req.body);
    new OkRequestSuccess('Added item to cart', {}).send(res);
  };
  updateCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    await cartService.updateCart(currentUser.id, req.body);
    new OkRequestSuccess('Cart has been updated', {}).send(res);
  };
  increaseItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    await cartService.increaseItemInCart(currentUser.id, req.body);
    new OkRequestSuccess('Increased a item in cart', {}).send(res);
  };
  decreaseItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    await cartService.decreaseItemInCart(currentUser.id, req.body);
    new OkRequestSuccess('Decreased a item in cart', {}).send(res);
  };
  removeItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    await cartService.removeItemInCart(currentUser.id, req.body);
    new OkRequestSuccess('A item has been removed in cart', {}).send(res);
  };
}

export const cartController = new CartController();
