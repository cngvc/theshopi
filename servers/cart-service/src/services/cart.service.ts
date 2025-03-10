import { cartCache } from '@cart/redis/cart-cache';
import { ICartItem } from '@cngvc/shopi-shared-types';

class CartService {
  private generateCartKey(authId: string): string {
    return `cart:user:${authId}`;
  }

  async getCart(authId: string): Promise<ICartItem[]> {
    const key = this.generateCartKey(authId);
    const cart = await cartCache.getCart(key);
    return cart;
  }

  async deleteCart(authId: string): Promise<void> {
    const key = this.generateCartKey(authId);
    const cart = await cartCache.deleteCart(key);
    return cart;
  }

  async addToCart(authId: string, item: ICartItem) {
    const key = this.generateCartKey(authId);
    const cart = await cartCache.saveCart(key, item.productPublicId, item.quantity);
    return cart;
  }

  async updateCart(authId: string, item: ICartItem) {
    const key = this.generateCartKey(authId);
    const cart = await cartCache.updateCart(key, item.productPublicId, item.quantity);
    return cart;
  }

  async increaseItemInCart(authId: string, item: ICartItem) {
    const key = this.generateCartKey(authId);
    const cart = await cartCache.increaseItemInCart(key, item.productPublicId);
    return cart;
  }

  async decreaseItemInCart(authId: string, item: ICartItem) {
    const key = this.generateCartKey(authId);
    const cart = await cartCache.decreaseItemInCart(key, item.productPublicId);
    return cart;
  }

  async removeItemInCart(authId: string, item: ICartItem) {
    const key = this.generateCartKey(authId);
    const cart = await cartCache.removeItemInCart(key, item.productPublicId);
    return cart;
  }
}

export const cartService = new CartService();
