import { grpcProductClient } from '@cart/grpc/clients/product-client.grpc';
import { cartCache } from '@cart/redis/cart-cache';
import { ICartItem, IProductDocument } from '@cngvc/shopi-shared-types';

class CartService {
  private generateCartKey(authId: string): string {
    return `cart:user:${authId}`;
  }

  async getCart(authId: string): Promise<(ICartItem & IProductDocument)[]> {
    const key = this.generateCartKey(authId);
    const items = await cartCache.getCart(key);
    const productPublicIds = items.map((e) => e.productPublicId);
    if (!productPublicIds.length) return [];
    const { products } = await grpcProductClient.getProductsByProductPublicIds(productPublicIds);
    return items.map((item) => {
      const product = products.find((p) => p.productPublicId === item.productPublicId);
      return {
        ...product,
        ...item
      } as ICartItem & IProductDocument;
    });
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
    await cartCache.updateCart(key, item.productPublicId, item.quantity);
  }

  async increaseItemInCart(authId: string, item: ICartItem) {
    const key = this.generateCartKey(authId);
    await cartCache.increaseItemInCart(key, item.productPublicId);
  }

  async decreaseItemInCart(authId: string, item: ICartItem) {
    const key = this.generateCartKey(authId);
    await cartCache.decreaseItemInCart(key, item.productPublicId);
  }

  async removeItemInCart(authId: string, item: ICartItem) {
    const key = this.generateCartKey(authId);
    await cartCache.removeItemInCart(key, item.productPublicId);
  }
}

export const cartService = new CartService();
