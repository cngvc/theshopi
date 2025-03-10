import { cartService } from '@cart/services/cart.service';
import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { ICartItem } from '@cngvc/shopi-shared-types';
import { Request, Response } from 'express';

class CartController {
  getCart = async (req: Request, res: Response): Promise<void> => {
    const cart = await cartService.getCart(req.currentUser!.id);
    new OkRequestSuccess('Cart items', { cart }).send(res);
  };
  addToCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.addToCart(req.currentUser!.id, req.body);
    new OkRequestSuccess('Added item to cart', { cart }).send(res);
  };
  updateCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.updateCart(req.currentUser!.id, req.body);
    new OkRequestSuccess('Cart has been updated', { cart }).send(res);
  };
  increaseItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.increaseItemInCart(req.currentUser!.id, req.body);
    new OkRequestSuccess('Increased a item in cart', { cart }).send(res);
  };
  decreaseItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.decreaseItemInCart(req.currentUser!.id, req.body);
    new OkRequestSuccess('Decreased a item in cart', { cart }).send(res);
  };
  removeItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.removeItemInCart(req.currentUser!.id, req.body);
    new OkRequestSuccess('A item has been removed in cart', { cart }).send(res);
  };
}

export const cartController = new CartController();
