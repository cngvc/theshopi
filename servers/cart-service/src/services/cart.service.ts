import { cartCache } from '@cart/redis/cart-cache';
import { ICartItem } from '@cngvc/shopi-shared-types';

class CartService {
  private generateCartKey(userId: string): string {
    return `cart:user:${userId}`;
  }

  async getCart(userId: string): Promise<ICartItem[]> {
    const key = this.generateCartKey(userId);
    const cart = await cartCache.getCart(key);
    return cart;
  }

  async addToCart(userId: string, item: ICartItem) {
    const key = this.generateCartKey(userId);
    const cart = await cartCache.saveCart(key, item.productPublicId, item.quantity);
    return cart;
  }

  async updateCart(userId: string, item: ICartItem) {
    const key = this.generateCartKey(userId);
    const cart = await cartCache.updateCart(key, item.productPublicId, item.quantity);
    return cart;
  }

  async increaseItemInCart(userId: string, item: ICartItem) {
    const key = this.generateCartKey(userId);
    const cart = await cartCache.increaseItemInCart(key, item.productPublicId);
    return cart;
  }

  async decreaseItemInCart(userId: string, item: ICartItem) {
    const key = this.generateCartKey(userId);
    const cart = await cartCache.decreaseItemInCart(key, item.productPublicId);
    return cart;
  }

  async removeItemInCart(userId: string, item: ICartItem) {
    const key = this.generateCartKey(userId);
    const cart = await cartCache.removeItemInCart(key, item.productPublicId);
    return cart;
  }
}

export const cartService = new CartService();
