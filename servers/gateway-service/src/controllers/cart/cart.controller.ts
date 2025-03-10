import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { cartService } from '@gateway/services/api/cart.service';
import { Request, Response } from 'express';

class CartController {
  getCart = async (req: Request, res: Response) => {
    const response = await cartService.getCart();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  addToCart = async (req: Request, res: Response) => {
    const response = await cartService.addToCart(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  updateCart = async (req: Request, res: Response) => {
    const response = await cartService.updateCart(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  increaseItemInCart = async (req: Request, res: Response) => {
    const response = await cartService.increaseItemInCart(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  decreaseItemInCart = async (req: Request, res: Response) => {
    const response = await cartService.decreaseItemInCart(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  removeItemInCart = async (req: Request, res: Response) => {
    const response = await cartService.removeItemInCart(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
}

export const cartController = new CartController();
