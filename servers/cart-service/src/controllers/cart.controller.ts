import { cartService } from '@cart/services/cart.service';
import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { ICartItem } from '@cngvc/shopi-shared-types';
import { Request, Response } from 'express';

class CartController {
  getCart = async (req: Request, res: Response): Promise<void> => {
    const cart = await cartService.getCart(req.currentUser!.username);
    new OkRequestSuccess('Cart', { cart }).send(res);
  };
  addToCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.addToCart(req.currentUser!.username, req.body);
    new OkRequestSuccess('Cart', { cart }).send(res);
  };
  updateCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.updateCart(req.currentUser!.username, req.body);
    new OkRequestSuccess('Cart', { cart }).send(res);
  };
  increaseItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.increaseItemInCart(req.currentUser!.username, req.body);
    new OkRequestSuccess('Cart', { cart }).send(res);
  };
  decreaseItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.decreaseItemInCart(req.currentUser!.username, req.body);
    new OkRequestSuccess('Cart', { cart }).send(res);
  };
  removeItemInCart = async (req: Request<{}, {}, ICartItem>, res: Response): Promise<void> => {
    const cart = await cartService.removeItemInCart(req.currentUser!.username, req.body);
    new OkRequestSuccess('Cart', { cart }).send(res);
  };
}

export const cartController = new CartController();
