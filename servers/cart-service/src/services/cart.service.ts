import { grpcProductClient } from '@cart/grpc/clients/product-client.grpc';
import { cartCache } from '@cart/redis/cart-cache';
import { NotFoundError } from '@cngvc/shopi-shared';
import { ICartItem } from '@cngvc/shopi-types';

class CartService {
  private generateCartKey(authId: string): string {
    return `cart:user:${authId}`;
  }

  async getCart(authId: string): Promise<ICartItem[]> {
    const key = this.generateCartKey(authId);
    const items = await cartCache.getCart(key);
    return items;
  }

  async deleteCart(authId: string): Promise<void> {
    const key = this.generateCartKey(authId);
    const cart = await cartCache.deleteCart(key);
    return cart;
  }

  async addToCart(authId: string, item: ICartItem) {
    const product = await grpcProductClient.getProductByProductPublicId(item.productPublicId);
    if (!product) {
      throw new NotFoundError('Product not found.', 'addToCart');
    }
    const cartItem: ICartItem = {
      productPublicId: item.productPublicId,
      quantity: item.quantity,
      slug: product.slug,
      price: product.price,
      name: product.name,
      thumb: product.thumb
    };
    const key = this.generateCartKey(authId);
    const cart = await cartCache.saveCart(key, cartItem, cartItem.quantity);
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
